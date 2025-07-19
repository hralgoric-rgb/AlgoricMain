import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting cleanup process...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    const { email } = await request.json();

    console.log("Cleaning up unverified user for email:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find and delete unverified user
    console.log("Searching for unverified user...");
    const result = await User.findOneAndDelete({ 
      email: email,
      emailVerified: { $exists: false } // User is not verified
    });

    if (result) {
      console.log("Unverified user deleted successfully");
      return NextResponse.json(
        {
          success: true,
          message: "Unverified user deleted successfully. You can now register again.",
        },
        { status: 200 }
      );
    } else {
      console.log("No unverified user found or user is already verified");
      return NextResponse.json(
        {
          success: false,
          message: "No unverified user found with this email, or user is already verified.",
        },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Cleanup Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "An error occurred during cleanup" },
      { status: 500 }
    );
  }
} 