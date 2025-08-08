import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";
import { sendEmail } from "@/app/lib/utils";

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
  // OTP fields for property posting
  postOtp: String,
  postOtpExpiry: Date,
  otpVerified: { type: Boolean, default: false },
});
const KycRequest = mongoose.models.KycRequest || mongoose.model("KycRequest", KycRequestSchema);

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { status, reason } = await req.json();
    const adminIdHeader = req.headers.get("authorization");
    let adminId = undefined;
    if (adminIdHeader && mongoose.Types.ObjectId.isValid(adminIdHeader)) {
      adminId = adminIdHeader;
    }
    const { id } = await context.params;
    console.log('PATCH KYC', { id, status, reason });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid KYC ID:', id);
      return NextResponse.json({ error: "Invalid KYC ID" }, { status: 400 });
    }
    const kyc = await KycRequest.findById(id);
    if (!kyc) {
      console.error('KYC request not found:', id);
      return NextResponse.json({ error: "KYC request not found" }, { status: 404 });
    }
    kyc.status = status;
    kyc.reviewedAt = new Date();
    if (adminId) {
      kyc.adminId = adminId;
    }
    kyc.reason = reason || "";

    // If KYC is accepted, generate OTP for property posting
    if (status === "accepted") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // 10 minutes expiry
      
      kyc.postOtp = otp;
      kyc.postOtpExpiry = otpExpiry;
      kyc.otpVerified = false;
      
      // Send email with OTP
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 KYC Approved!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your KYC verification has been successfully approved</p>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">You can now post properties!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Congratulations! Your KYC verification has been approved. You can now post properties on 100Gaj Equity platform.
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #333; margin: 0 0 10px 0;">Your Property Posting OTP</h3>
              <div style="background: #667eea; color: white; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 10px 0;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
                This OTP is valid for 10 minutes. Use it when posting your first property.
              </p>
            </div>
            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
              <h4 style="color: #28a745; margin: 0 0 10px 0;">Next Steps:</h4>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li>Go to the property posting page</li>
                <li>Click "Post Now" button</li>
                <li>Enter the OTP above when prompted</li>
                <li>Fill in your property details</li>
                <li>Submit your property listing</li>
              </ul>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 25px; text-align: center;">
              Thank you for choosing 100Gaj Equity! 🏠
            </p>
          </div>
        </div>
      `;
      
      try {
        console.log("Attempting to send KYC approval email to:", kyc.email);
        console.log("Email configuration:", {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          user: process.env.EMAIL_SERVER_USER ? "Set" : "Not set",
          pass: process.env.EMAIL_SERVER_PASSWORD ? "Set" : "Not set",
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER
        });
        
        const emailResult = await sendEmail(kyc.email, "🎉 KYC Approved - You can now post properties!", emailHtml);
        console.log("Email sent successfully:", emailResult);
      } catch (emailError) {
        console.error("Failed to send KYC approval email:", emailError);
        console.error("Email error details:", {
          message: emailError.message,
          code: emailError.code,
          command: emailError.command
        });
        // Continue even if email fails
      }
    }
    await kyc.save();
    
    // Mock email notification
    if (kyc.email) {
      if (status === "accepted") {
        console.log(`Email to ${kyc.email}: Your KYC has been accepted!`);
      } else {
        console.log(`Email to ${kyc.email}: Your KYC has been rejected. Reason: ${reason || "Not specified"}`);
      }
    }
    
    // Return OTP in response for debugging (remove in production)
    const responseData = { success: true, kyc: kyc.toObject() };
    if (status === "accepted" && kyc.postOtp) {
      responseData.otp = kyc.postOtp; // Remove this in production
      console.log("Generated OTP for debugging:", kyc.postOtp);
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('PATCH KYC error:', error);
    return NextResponse.json({ error: "Failed to update KYC status" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const kyc = await KycRequest.findById(id).lean();
    if (!kyc) {
      return NextResponse.json({ error: "KYC request not found" }, { status: 404 });
    }
    return NextResponse.json({ kyc });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch KYC request" }, { status: 500 });
  }
} 