import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { generateVerificationCode } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting fix verification process...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    const { email } = await request.json();

    console.log("Fixing verification for email:", email);

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

    console.log("Generating new verification code...");
    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    // Update user with verification code
    user.verificationToken = verificationCode;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    console.log("Verification code added successfully");
    return NextResponse.json(
      {
        success: true,
        message: "Verification code added successfully. Use this code: " + verificationCode,
        verificationCode: verificationCode,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fix Verification Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "An error occurred while fixing verification" },
      { status: 500 }
    );
  }
} 