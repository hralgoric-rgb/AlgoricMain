import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { Types } from "mongoose";
import CommercialProperty from "@/app/models/CommercialProperty";

export async function GET() {
  try {
    await connectDB();

    const rawProperties = await CommercialProperty.find(
      {},
      {
        name: 1,
        type: 1,
        location: 1,
        totalShares: 1,
        availableShares: 1,
        pricePerShare: 1,
        currentYield: 1,
        predictedAppreciation: 1,
        riskLevel: 1,
        images: 1,
        description: 1,
        monthlyRental: 1,
        totalArea: 1,
        occupancyRate: 1,
        totalValue: 1,
        features: 1,
      }
    ).lean();

    const properties = rawProperties.map((property) => ({
      ...property,
      id: (property._id as Types.ObjectId).toString(),
    }));

    return NextResponse.json({ success: true, data: properties });
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const newProperty = await CommercialProperty.create(body);

    return NextResponse.json(
      { success: true, data: newProperty },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create property",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
