import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/(microestate)/models/user';
import dbConnect from '@/app/(microestate)/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { password, email } = await request.json();

    if (!password || !email) {
      return NextResponse.json(
        { message: "Password and email are required!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user and clear reset fields
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: ""
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}