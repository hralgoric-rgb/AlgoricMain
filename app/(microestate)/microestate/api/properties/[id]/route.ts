import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import Property from "@/app/(microestate)/models/Property";
import mongoose from "mongoose";
import { requireLandlord } from "@/app/(microestate)/lib/authorize";

// Helper function to validate ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// GET microestate/api/properties/[id] - get property detail of a landlord
export const GET = requireLandlord(
  async (
    request: NextRequest, 
    context: {
      params: { id: string };
      userId: string;
      userRole: string;
      userEmail: string;
    }
  ) => {
    const { id } = context.params;
    const { userId } = context;

    try {
      console.log(`Fetching property with id: ${id} for landlord: ${userId}`);

      if (!isValidObjectId(id)) {
        return NextResponse.json(
          { error: "Invalid property ID format" },
          { status: 400 }
        );
      }

      await dbConnect();

      // Find the property ensuring it belongs to the logged-in landlord
      const property = await Property.findOne({ _id: id, landlordId: userId })
        .select("-landlordId")
        .lean();

      if (!property) {
        return NextResponse.json(
          {
            error:
              "Property not found or you do not have permission to view it.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(property, { status: 200 });
    } catch (error) {
      console.error("Error fetching property:", error);
      return NextResponse.json(
        { error: "An error occurred while fetching the property" },
        { status: 500 }
      );
    }
  }
);

// PUT /api/properties/[id] - Update a property
export const PUT = requireLandlord(
  async (
    request: NextRequest,
    context: {
      params: { id: string };
      userId: string;
      userRole: string;
      userEmail: string;
    }
  ) => {
    try {
      const { id } = context.params;
      const { userId } = context;

      if (!isValidObjectId(id)) {
        return NextResponse.json(
          { error: 'Invalid property ID format' },
          { status: 400 }
        );
      }

      await dbConnect();

      // Find property and check ownership
      const property = await Property.findOne({ _id: id, landlordId: userId });

      if (!property) {
        return NextResponse.json(
          { error: 'Property not found or you do not have permission to update it' },
          { status: 404 }
        );
      }

      // Parse JSON data from request body
      const formData = await request.json();
      
      // Extract data from JSON
      const {
        title,
        description,
        propertyType,
        bedrooms,
        bathrooms,
        squareFootage,
        securityDeposit,
        rent,
        amenities,
        features,
        address,
        images
      } = formData;
      
      // Update property data
      const updateData: any = {
        title,
        description,
        propertyType,
        bedrooms,
        bathrooms,
        squareFootage,
        securityDeposit,
        rent,
        amenities,
        features,
        address,
        images,
        lastUpdated: new Date()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      // Update the property
      const updatedProperty = await Property.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return NextResponse.json(
        {
          success: true,
          message: 'Property updated successfully',
          property: updatedProperty,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error updating property:", error);

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message,
        }));

        return NextResponse.json(
          { error: 'Validation failed', details: validationErrors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'An error occurred while updating the property' },
        { status: 500 }
      );
    }
  }
);

// DELETE /api/properties/[id] - Delete a property
export const DELETE = requireLandlord(
  async (
    request: NextRequest,
    context: {
      params: { id: string };
      userId: string;
      userRole: string;
      userEmail: string;
    }
  ) => {
    try {
      const { id } = context.params;
      const { userId } = context;

      if (!isValidObjectId(id)) {
        return NextResponse.json(
          { error: 'Invalid property ID format' },
          { status: 400 }
        );
      }

      await dbConnect();

      // Find property and check ownership
      const property = await Property.findOne({ _id: id, landlordId: userId });

      if (!property) {
        return NextResponse.json(
          { error: 'Property not found or you do not have permission to delete it' },
          { status: 404 }
        );
      }

      // Delete the property
      await Property.findByIdAndDelete(id);

      return NextResponse.json(
        {
          success: true,
          message: 'Property deleted successfully',
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting property:", error);
      return NextResponse.json(
        { error: 'An error occurred while deleting the property' },
        { status: 500 }
      );
    }
  }
);
