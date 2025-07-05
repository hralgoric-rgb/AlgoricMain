import connectDB from "@/app/lib/mongodb";
import CommercialProperty from "@/app/models/CommercialProperty";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await connectDB();

    const property = await CommercialProperty.findById(id);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found with the given ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error("Error fetching property by ID:", error);

    return NextResponse.json(
      { error: "Invalid ID format or internal error" },
      { status: 500 }
    );
  }
}
