import dbConnect from "@/app/(microestate)/lib/db";
import { uploadToImageKit } from "@/app/(microestate)/lib/ImageUpload";
import User from "@/app/(microestate)/models/user";
import {
  generateVerificationCode,
  getVerificationEmailTemplate,
  sendEmail,
} from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    // Check if database URI is configured
    if (!process.env.MICRO_MONGODB_URI) {
      console.error("MICRO_MONGODB_URI is not configured");
      return NextResponse.json(
        { error: "Database configuration is missing" },
        { status: 500 }
      );
    }

    await dbConnect();
    
    // Test database connection
    try {
      await User.findOne({}).limit(1);
      console.log("Database connection successful");
    } catch (dbError) {
      console.error("Database connection test failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const form = await request.formData();
    const email = form.get("email")?.toString().trim();
    const password = form.get("password")?.toString();
    const firstName = form.get("firstName")?.toString().trim();
    const lastName = form.get("lastName")?.toString().trim();
    const phone = form.get("phone")?.toString();
    const role = form.get("role")?.toString() as "landlord" | "tenant";
    const profileImageFile = form.get("profileImage") as File | null;

    // Fixed: Get QR code with the correct field name
    const qrFile = form.get("qrCode") as File | null;

    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    // Handle QR code upload for landlords
    let qrCodeUrl: string | undefined;
    if (role === "landlord" && qrFile) {
      try {
        qrCodeUrl = await uploadToImageKit(qrFile);
      } catch (uploadError) {
        console.warn('QR code upload failed:', uploadError);
        // Continue without QR code upload
      }
    }

    // Handle profile image upload
    let profileImageUrl: string | undefined;
    if (profileImageFile) {
      try {
        profileImageUrl = await uploadToImageKit(profileImageFile);
      } catch (uploadError) {
        console.warn('Profile image upload failed:', uploadError);
        // Continue without profile image upload
      }
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    // Create user object with correct field mapping for microestate User model
    const userData = {
      firstName,
      lastName,
      phone,
      email,
      password,
      role,
      emailVerified: false, // Boolean, not Date
      verificationToken: verificationCode,
      verificationTokenExpiry,
      ...(profileImageUrl && { profileImage: profileImageUrl }),
      ...(qrCodeUrl && { qrCode: qrCodeUrl }),
    };

    console.log("Creating user with data:", {
      ...userData,
      password: "[REDACTED]",
    });

    console.log("User model schema:", User.schema.obj);
    
    const newUser = new User(userData);
    console.log("User instance created:", newUser);
    
    // Validate the data before saving
    const validationError = newUser.validateSync();
    if (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { error: `Validation failed: ${validationError.message}` },
        { status: 400 }
      );
    }
    
    await newUser.save();

    console.log("User created successfully:", newUser._id);

    // Try to send verification email
    try {
      const emailTemplate = getVerificationEmailTemplate(verificationCode);
      await sendEmail(email, "Verify your email address", emailTemplate);
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    // Generate NextAuth compatible JWT token
    const jwtSecret = process.env.NEXTAUTH_SECRET;
    let sessionToken = null;
    
    if (jwtSecret) {
      // Create token payload similar to NextAuth format
      const tokenPayload = {
        _id: newUser._id.toString(),
  id: newUser._id.toString(),
  email: newUser.email,
  role: newUser.role,
  name: `${newUser.firstName} ${newUser.lastName}`,
  firstName: newUser.firstName,
  lastName: newUser.lastName,
  phone: newUser.phone, // ADD THIS
  emailVerified: newUser.emailVerified,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60,
      };

      sessionToken = jwt.sign(tokenPayload, jwtSecret);
    } else {
      console.warn("NEXTAUTH_SECRET is not configured, skipping JWT token generation");
    }

    const response = NextResponse.json(
      {
        success: true,
        message:
          "User registered successfully. Please check your email for verification code.",
        userId: newUser._id,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: `${newUser.firstName} ${newUser.lastName}`,
          role: newUser.role,
          emailVerified: newUser.emailVerified,
        },
        profileImageUrl,
        qrCodeUrl,
      },
      { status: 201 }
    );

    // Set the same cookie that NextAuth would set
    if (sessionToken) {
      response.cookies.set("microauth", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3 * 24 * 60 * 60, // 3 days
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Registration Error:", error);
   ;


    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Return the actual error message for debugging
    return NextResponse.json(
      { error: error.message || "An error occurred during registration" },
      { status: 500 }
    );
  }
}