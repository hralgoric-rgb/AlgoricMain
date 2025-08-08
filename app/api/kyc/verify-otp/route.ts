import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const KycRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  pan: String,
  panImageUrl: String,
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: String,
  email: String,
  postOtp: String,
  postOtpExpiry: Date,
  otpVerified: { type: Boolean, default: false },
});
const KycRequest = mongoose.models.KycRequest || mongoose.model("KycRequest", KycRequestSchema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const requestingUserId = decodedToken.userId || decodedToken.sub;
    
    const { userId, kycId, otp } = await req.json();
    
    console.log("OTP verification request:", { userId, kycId, otp, requestingUserId }); // Debug log
    
    if (!otp || (!userId && !kycId)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    let kyc;
    if (kycId) {
      if (!mongoose.Types.ObjectId.isValid(kycId)) {
        return NextResponse.json({ error: "Invalid KYC ID" }, { status: 400 });
      }
      kyc = await KycRequest.findById(kycId);
    } else {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
      kyc = await KycRequest.findOne({ userId, status: "accepted" });
    }
    
    if (!kyc) {
      return NextResponse.json({ error: "KYC record not found" }, { status: 404 });
    }
    
    // Ensure the requesting user owns this KYC
    if (kyc.userId.toString() !== requestingUserId) {
      return NextResponse.json({ error: "Unauthorized access to this KYC record" }, { status: 403 });
    }
    
    if (kyc.otpVerified) {
      return NextResponse.json({ success: true, message: "OTP already verified" });
    }
    if (!kyc.postOtp || !kyc.postOtpExpiry) {
      return NextResponse.json({ error: "No OTP generated for this KYC" }, { status: 400 });
    }
    console.log("OTP verification details:", { 
      kycOtp: kyc.postOtp, 
      providedOtp: otp, 
      match: kyc.postOtp === otp,
      expiry: kyc.postOtpExpiry,
      now: new Date(),
      expired: new Date() > new Date(kyc.postOtpExpiry)
    }); // Debug log
    
    if (kyc.postOtp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }
    if (new Date() > new Date(kyc.postOtpExpiry)) {
      return NextResponse.json({ error: "OTP expired" }, { status: 401 });
    }
    kyc.otpVerified = true;
    await kyc.save();
    return NextResponse.json({ success: true, message: "OTP verified. You can now post your property." });
  } catch (error) {
    console.error("OTP verification error:", error); // Debug log
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
} 