import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/models/User";
import {
  generateVerificationCode,
  getVerificationEmailTemplate,
  sendEmail,
} from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting resend verification code process...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    const { email } = await request.json();

    console.log("Resending code to email:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    console.log("Searching for user by email...");
    const user = await User.findOne({ email });

    if (!user) {
      console.log("No user found with this email");
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      console.log("User already verified");
      return NextResponse.json(
        { error: "User is already verified" },
        { status: 400 }
      );
    }

    console.log("Generating new verification code...");
    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    // Update user with new verification code
    user.verificationToken = verificationCode;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    console.log("Sending new verification email...");
    // Send new verification email
    try {
      const emailTemplate = getVerificationEmailTemplate(verificationCode);
      await sendEmail(email, "Verify your email address", emailTemplate);
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    console.log("Verification code resent successfully");
    return NextResponse.json(
      {
        success: true,
        message: "Verification code resent successfully. Please check your email.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "An error occurred while resending the code" },
      { status: 500 }
    );
  }
} 