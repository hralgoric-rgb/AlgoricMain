import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import Property from "@/app/(microestate)/models/Property";
import { requireLandlord } from "@/app/(microestate)/middleware";


// GET microestate/api/properties- get all properties of a landlord
export const GET = requireLandlord(async (
  request: NextRequest,
  context: { userId: string; userRole: string; userEmail: string }
) => {
  const { userId, userRole, userEmail } = context;
  try {
    
    await dbConnect();

    const property = await Property.find({landlordId: userId}).select("title propertyType address status createdAt ").sort({createdAt: -1})
    .lean();

    if (!property) {
      return NextResponse.json(
        { error: 'No Properties Found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property, { status: 200 });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching the properties' },
      { status: 500 }
    );
  }
}
);


// POST /api/properties - Create a new property listing
export const POST = requireLandlord(async (request: NextRequest, context: { userId: string; userRole: string; userEmail: string }) => {
  try {
    const { userId, userRole, userEmail } = context;

    await dbConnect();

    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "rent",
      "propertyType",
      "area",
      "address",
      "images",
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Handle address required fields
    if (!data.address) {
      return NextResponse.json(
        { error: "Address must include street, city, and state" },
        { status: 400 }
      );
    }

    if (!data.address.state) {
      data.address.state = "Delhi"; // Default state
    }

    // Set default zipCode if not provided
    if (!data.address.zipCode) {
      data.address.zipCode = "110001"; // Default Delhi zipcode
    }

    // Create property object with defaults for any missing fields
    const propertyData = {
      ...data,
      landlordId: userId, // Use the authenticated user's ID as the landlord ID
      status: data.status || "available",
      // Set defaults for optional fields that are required by the model
      amenities: data.amenities || [],
      features: data.features || [],
    };

    // Create new property
    const property = new Property(propertyData);

    await property.save();

    return NextResponse.json(
      {
        success: true,
        message: "Property created successfully",
        property,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));

      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while creating the property" },
      { status: 500 }
    );
  }
});
