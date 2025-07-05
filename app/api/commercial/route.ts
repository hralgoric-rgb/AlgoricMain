import connectDB from "@/app/lib/mongodb";
import CommercialProperty from "@/app/models/CommercialProperty";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const properties = await CommercialProperty.find();

    return NextResponse.json(
      {
        success: true,
        message: "Properties fetched successfully",
        data: properties,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /commercialProperties error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch commercial properties",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.totalPropertyValue) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: title or totalPropertyValue",
        },
        { status: 400 }
      );
    }

    const created = await CommercialProperty.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Commercial property created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /commercialProperties error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create commercial property",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
