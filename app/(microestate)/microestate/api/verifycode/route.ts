import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting email verification process...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    const { code } = await request.json();

    console.log("Received verification code:", code);

    if (!code) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    // Find user with this verification code
    console.log("Searching for user with verification code...");
    const user = await User.findOne({ 
      verificationToken: code,
      verificationTokenExpiry: { $gt: new Date() } // Check if code hasn't expired
    });

    console.log("Search query:", { verificationToken: code, verificationTokenExpiry: { $gt: new Date() } });

    if (!user) {
      console.log("No user found with this verification code or code expired");
      
      // Let's also check if there are any users with verification tokens at all
      const allUsersWithTokens = await User.find({ verificationToken: { $exists: true } });
      console.log("All users with verification tokens:", allUsersWithTokens.map(u => ({ 
        email: u.email, 
        verificationToken: u.verificationToken,
        verificationTokenExpiry: u.verificationTokenExpiry 
      })));
      
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    console.log("User found, updating verification status...");

    // Update user to mark as verified
    user.emailVerified = new Date();
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    console.log("User verified successfully:", user.email);

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully! You can now login.",
        userId: user._id,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verification Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 }
    );
  }
}