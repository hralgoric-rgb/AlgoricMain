import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing User model...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    // Get the schema definition
    const schema = User.schema;
    const roleField = schema.path('role');
    
    console.log("Role field definition:", roleField);
    console.log("Role enum values:", roleField.enumValues);
    
    return NextResponse.json(
      {
        success: true,
        modelName: User.modelName,
        roleEnumValues: roleField.enumValues,
        roleField: {
          instance: roleField.instance,
          enumValues: roleField.enumValues,
          required: roleField.required,
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Test Error:", error);
    return NextResponse.json(
      { error: "An error occurred during testing" },
      { status: 500 }
    );
  }
} 