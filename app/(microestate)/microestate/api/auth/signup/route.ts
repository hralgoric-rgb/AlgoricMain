import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/(microestate)/lib/db';
import MicroestateUser from "@/app/(microestate)/models/user";
import {
  generateVerificationCode,
  getVerificationEmailTemplate,
  sendEmail,
} from "@/app/lib/utils";
import { uploadToImageKit } from '@/app/(microestate)/lib/ImageUpload';


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Parse FormData instead of JSON
    const formData = await request.formData();
    
    // Extract fields from FormData
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as 'landlord' | 'tenant';
    
    const qrCode = formData.get('qrCode') as File | null;

    console.log('📝 Received signup data:', {
      firstName,
      lastName,
      email,
      phone,
      role,
      hasQrCode: !!qrCode
    });

    // Validation
    if (!firstName || !lastName || !email || !password || !phone || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await MicroestateUser.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Handle QR code upload for landlords
    let qrCodeUrl: string | undefined;
    if (role === "landlord" && qrCode) {
      try {
        qrCodeUrl = await uploadToImageKit(qrCode);
      } catch (uploadError) {
        console.warn('QR code upload failed:', uploadError);
        // Continue without QR code upload
      }
    }

     // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);


    // Create new user (password will be hashed by the schema middleware)
    const newUser = new MicroestateUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password,
      phone: phone.trim(),
      role,
      emailVerified: false,
      verificationToken: verificationCode,
      verificationTokenExpiry,
      ...(qrCodeUrl && { qrCode: qrCodeUrl }),
    });

    await newUser.save();

    console.log("✅ New user created:", {
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role
    });

    try {
      const emailTemplate = getVerificationEmailTemplate(verificationCode);
      await sendEmail(email, "Verify your email address", emailTemplate);
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser._id.toString(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      }
    });

  } catch (error) {
    console.error('❌ Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create account' },
      { status: 500 }
    );
  }
}