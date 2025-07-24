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
    await dbConnect();

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
      qrCodeUrl = await uploadToImageKit(qrFile);
    }

    // Handle profile image upload
    let profileImageUrl: string | undefined;
    if (profileImageFile) {
      profileImageUrl = await uploadToImageKit(profileImageFile);
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    // Create user object with correct field mapping
    const userData = {
      firstName,
      lastName,
      phone,
      email,
      password,
      role,
      emailVerified: false, // Boolean, not string
      verificationToken: verificationCode,
      verificationTokenExpiry,
      ...(profileImageUrl && { profileImage: profileImageUrl }),
      ...(qrCodeUrl && { qrCode: qrCodeUrl }), // Fixed: use qrCode instead of qr
    };

    console.log("Creating user with data:", {
      ...userData,
      password: "[REDACTED]",
    });

    const newUser = new User(userData);
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
    if (!jwtSecret) {
      throw new Error("NEXTAUTH_SECRET is not configured");
    }

    // Create token payload similar to NextAuth format
    const tokenPayload = {
      _id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: `${newUser.firstName} ${newUser.lastName}`,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      emailVerified: newUser.emailVerified,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60, // 3 days
    };

    const sessionToken = jwt.sign(tokenPayload, jwtSecret);

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
    response.cookies.set("microauth", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3 * 24 * 60 * 60, // 3 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // Return more specific error messages
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(", ")}` },
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
