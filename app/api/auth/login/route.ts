import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { comparePassword, generateToken } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Email not verified', 
          message: 'Please verify your email address before logging in',
          userId: user._id 
        },
        { status: 403 }
      );
    }

    // Check if user has a password (users with Google OAuth might not have a password)
    if (!user.password) {
      return NextResponse.json(
        { error: 'Please use Google Sign-In for this account' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({ 
      userId: user._id, 
      email: user.email 
    });

    // Return user info without sensitive data
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: userWithoutPassword,
        token 
      },
      { status: 200 }
    );
  } catch (_error) {

    return NextResponse.json(
      { error: `An error occurred during login,${_error}` },
      { status: 500 }
    );
  }
} 