import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { generateVerificationCode } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting role update process...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    const { email, newRole } = await request.json();

    console.log("Updating role for email:", email, "to:", newRole);

    if (!email || !newRole) {
      return NextResponse.json(
        { error: "Email and new role are required" },
        { status: 400 }
      );
    }

    // Find user by email
    console.log("Searching for user...");
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user role
    console.log("Updating user role...");
    user.role = newRole;
    await user.save();

    console.log("Role updated successfully");
    return NextResponse.json(
      {
        success: true,
        message: `User role updated to ${newRole} successfully`,
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
    console.error("Role Update Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "An error occurred while updating role" },
      { status: 500 }
    );
  }
} 