import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔓 Clearing microauth cookie...");

    // Create response
    const response = NextResponse.json(
      { success: true, message: 'Microauth cookie cleared successfully' },
      { status: 200 }
    );

    // Clear the microauth cookie
    response.cookies.set('microauth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    console.log("✅ Microauth cookie cleared");
    return response;
  } catch (error) {
    console.error("❌ Error clearing microauth cookie:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear microauth cookie' },
      { status: 500 }
    );
  }
}
