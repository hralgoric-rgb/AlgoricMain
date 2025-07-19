import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import {
  generateVerificationCode,
  getVerificationEmailTemplate,
  sendEmail,
} from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting registration process...");
    
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }
    
    await dbConnect();
    console.log("Database connected successfully");
    
    const { email, password, firstName, role, lastName, phone } = await request.json();

    console.log("Received registration data:", { email, firstName, lastName, phone, role });

    if (!email || !password || !firstName.trim() || !lastName.trim() || !phone) {
      console.log("Validation failed - missing required fields");
      return NextResponse.json(
        {
          error: "Name, email, and password, First name, lastname, phone no are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      console.log("Validation failed - password too short");
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    console.log("Checking if user already exists...");
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists but is not verified, allow re-registration
      if (!existingUser.emailVerified) {
        console.log("User exists but not verified, allowing re-registration");
        // Delete the unverified user to allow fresh registration
        await User.findByIdAndDelete(existingUser._id);
        console.log("Deleted unverified user to allow re-registration");
      } else {
        console.log("User already exists and is verified:", email);
        return NextResponse.json(
          {
            error: "User already exists",
          },
          { status: 400 }
        );
      }
    }

    console.log("Creating new user...");
    // Generate verification code first
    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    // Create new user with the correct schema
    const userData = {
      name: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      email,
      password, // Password is now passed directly
      phone,
      role: role || "tenant", // Use the provided role or default to "tenant"
      verificationToken: verificationCode,
      verificationTokenExpiry: verificationTokenExpiry,
    };
    
    console.log("User data to save:", userData);
    
    const newUser = new User(userData);

    console.log("Saving user to database...");
    await newUser.save();
    console.log("User saved successfully:", newUser._id);

    // Try to send verification email, but don't fail the registration if email fails
    try {
      console.log("Attempting to send verification email...");
      const emailTemplate = getVerificationEmailTemplate(verificationCode);
      await sendEmail(email, "Verify your email address", emailTemplate);
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    console.log("Registration completed successfully");
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please check your email for verification code.",
        userId: newUser._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Return more specific error messages
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
