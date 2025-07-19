import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Clearing test users...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    // Delete all users (for testing purposes)
    const result = await User.deleteMany({});
    
    console.log("Deleted users count:", result.deletedCount);
    
    return NextResponse.json(
      {
        success: true,
        message: `Cleared ${result.deletedCount} users from database`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Clear Users Error:", error);
    return NextResponse.json(
      { error: "An error occurred while clearing users" },
      { status: 500 }
    );
  }
} 