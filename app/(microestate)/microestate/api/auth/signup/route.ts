import dbConnect from "@/app/(microestate)/lib/db";
import { uploadToImageKit } from "@/app/(microestate)/lib/ImageUpload";
import User from "@/app/(microestate)/models/user";
import {
  generateVerificationCode,
  getVerificationEmailTemplate,
  sendEmail,
} from "@/app/lib/utils";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const form = await request.formData();
    const email     = form.get("email")?.toString().trim();
    const password  = form.get("password")?.toString();
    const firstName = form.get("firstName")?.toString().trim();
    const lastName  = form.get("lastName")?.toString().trim();
    const phone     = form.get("phone")?.toString();
    const address   = form.get("address")?.toString();
    const role      = form.get("role")?.toString() as "landlord" | "tenant";
    const profileImageFile = form.get("profileImage") as File | null;
    const qrFile           = form.get("qr")           as File | null;


    if (!email || !password || !firstName || !lastName || !phone || !address) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (await User.findOne({ email })) {
      return NextResponse.json({ error: "User already exists." }, { status: 400 });
    }

    let qrCodeUrl: string | undefined;
    if (role === "landlord") {
      if (!qrFile) {
        return NextResponse.json({ error: "QR code file is required for landlords." }, { status: 400 });
      }
      qrCodeUrl = await uploadToImageKit(qrFile);
    }

    let profileImageUrl: string | undefined;
    if (profileImageFile) {
      profileImageUrl = await uploadToImageKit(profileImageFile);
    }

    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    const newUser = new User({
      firstName,
      lastName,
      phone,
      email,
      password,
      role,
      isVerified: false,
      verificationToken: verificationCode,
      verificationTokenExpiry,
      ...(profileImageUrl && { profileImage: profileImageUrl }),
      ...(qrCodeUrl       && { qrCode: qrCodeUrl }),
    });
    await newUser.save();

    try {
      await sendEmail(email, "Verify your email", getVerificationEmailTemplate(verificationCode));
    } catch (e) {
      console.error("Email send failed:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Registered. Please check your email for the verification code.",
      userId: newUser._id,
     profileImageUrl,
      qrCodeUrl
    }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Server error during registration." }, { status: 500 });
  }
}
