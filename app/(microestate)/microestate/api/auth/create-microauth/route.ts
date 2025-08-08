import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Creating microauth cookie...");

    // Verify the user is authenticated with NextAuth first
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token || !token.id) {
      console.log("❌ No valid NextAuth token found");
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, email, role, name } = body;

    // Validate that the token matches the request data
    if (token.id !== userId) {
      console.log("❌ Token user ID mismatch");
      return NextResponse.json(
        { success: false, message: 'Invalid request' },
        { status: 403 }
      );
    }

    // Create JWT for microauth cookie
    const jwtSecret = process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      console.error("❌ NEXTAUTH_SECRET not defined");
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const payload = {
      _id: userId,
      email: email,
      role: role,
      name: name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    };

    const microauthToken = jwt.sign(payload, jwtSecret);

    console.log("✅ Microauth token created for user:", userId);

    // Create response and set the microauth cookie
    const response = NextResponse.json(
      { success: true, message: 'Microauth cookie created successfully' },
      { status: 200 }
    );

    // Set the microauth cookie
    response.cookies.set('microauth', microauthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("❌ Error creating microauth cookie:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to create microauth cookie' },
      { status: 500 }
    );
  }
}
