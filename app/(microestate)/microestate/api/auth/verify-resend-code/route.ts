import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/models/User';
import dbConnect from '@/app/(microestate)/lib/db';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (
      !user ||
        !user.resetPasswordExpires ||   
      user.resetPasswordToken !== code ||
      new Date() > user.resetPasswordTokenExpiry
    ) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    // Code is valid
    return NextResponse.json(
      { success: true, message: 'Code verified', userId: user._id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Code verification error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}