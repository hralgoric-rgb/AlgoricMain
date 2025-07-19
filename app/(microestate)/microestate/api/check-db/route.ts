import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Checking database...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    // Check all collections
    const collections = await User.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Check if there are any users in the database
    const userCount = await User.countDocuments();
    console.log("User count:", userCount);
    
    // Get a sample user if any exists
    const sampleUser = await User.findOne();
    console.log("Sample user:", sampleUser);
    
    return NextResponse.json(
      {
        success: true,
        collections: collections.map(c => c.name),
        userCount: userCount,
        sampleUser: sampleUser,
        modelName: User.modelName,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Database Check Error:", error);
    return NextResponse.json(
      { error: "An error occurred during database check" },
      { status: 500 }
    );
  }
} 