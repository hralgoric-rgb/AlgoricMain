import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    console.log("Deleting all users...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    // Delete all users
    const result = await User.deleteMany({});
    
    console.log("Deleted users count:", result.deletedCount);
    
    return NextResponse.json(
      {
        success: true,
        message: `Successfully deleted ${result.deletedCount} users from database`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Users Error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting users" },
      { status: 500 }
    );
  }
} 