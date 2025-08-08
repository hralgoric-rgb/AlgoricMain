import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/(microestate)/middleware/auth";

export const GET = requireAuth(
  async (
    request: NextRequest,
    context: { userId: string; userRole: string; userEmail: string }
  ) => {
    const { userId, userRole, userEmail } = context;
    
    try {
      console.log("🧪 Test endpoint called by user:", { userId, userRole, userEmail });
      
      return NextResponse.json(
        {
          success: true,
          message: "Authentication is working!",
          user: {
            id: userId,
            role: userRole,
            email: userEmail,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("❌ Test endpoint error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "An error occurred in the test endpoint",
        },
        { status: 500 }
      );
    }
  }
);
