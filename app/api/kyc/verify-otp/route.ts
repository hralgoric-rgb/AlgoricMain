import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

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
    const { userId, kycId, otp } = await req.json();
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
    if (kyc.otpVerified) {
      return NextResponse.json({ success: true, message: "OTP already verified" });
    }
    if (!kyc.postOtp || !kyc.postOtpExpiry) {
      return NextResponse.json({ error: "No OTP generated for this KYC" }, { status: 400 });
    }
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
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
} 