import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting login process...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    const { email, password, role } = await request.json();

    console.log("Login attempt for email:", email, "with role:", role);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    console.log("Searching for user...");
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // // Check if email is verified
    // if (!user.emailVerified) {
    //   console.log("Email not verified");
    //   return NextResponse.json(
    //     { 
    //       error: "Email not verified", 
    //       message: "Please verify your email address before logging in",
    //       userId: user._id 
    //     },
    //     { status: 403 }
    //   );
    // }

    // Check if user role matches the requested role
    if (role && user.role !== role) {
      console.log("Role mismatch. User role:", user.role, "Requested role:", role);
      return NextResponse.json(
        { 
          error: "Role mismatch", 
          message: `You registered as a ${user.role}, but trying to login as ${role}`,
          userRole: user.role 
        },
        { status: 403 }
      );
    }

    // Check password using the User model's comparePassword method
    console.log("Verifying password...");
    console.log("User found:", {
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      emailVerified: !!user.emailVerified
    });
    
    try {
      const isPasswordValid = await user.comparePassword(password);
      console.log("Password comparison result:", isPasswordValid);
      
      if (!isPasswordValid) {
        console.log("Invalid password");
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    } catch (compareError) {
      console.error("Password comparison error:", compareError);
      return NextResponse.json(
        { error: "Password verification failed" },
        { status: 500 }
      );
    }

    console.log("Login successful for user:", user.email);

    // Return user info without sensitive data
    const userResponse = {
      id: user._id.toString(),
      name: user.firstName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    };

    return NextResponse.json(
      { 
        success: true, 
        message: "Login successful",
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
} 