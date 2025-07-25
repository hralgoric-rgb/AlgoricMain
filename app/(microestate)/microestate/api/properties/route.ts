import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import Property from "@/app/(microestate)/models/Property";
import { requireLandlord } from "@/app/(microestate)/lib/authorize";

// GET microestate/api/properties- get all properties of a landlord
export const GET = requireLandlord(
  async (
    request: NextRequest,
    context: { userId: string; userRole: string; userEmail: string }
  ) => {
    const { userId } = context;
    try {
      await dbConnect();

      // Use the correct field 'landlordId' as per your new model
      const properties = await Property.find({ landlordId: userId })
        .select("title propertyType address status createdAt rent")
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json(
        {
          success: true,
          message: "Properties fetched successfully",
          count: properties.length,
          properties: properties,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("❌ Error fetching properties:", error);
      return NextResponse.json(
        {
          success: false,
          error: "An error occurred while fetching the properties",
        },
        { status: 500 }
      );
    }
  }
);

// POST /api/properties - Create a new property listing
export const POST = requireLandlord(
  async (
    request: NextRequest,
    context: { userId: string; userRole: string; userEmail: string }
  ) => {
    try {
      const { userId, userEmail } = context;

      console.log("🏗️ Creating property for landlord:", userId);

      await dbConnect();

      const data = await request.json();
      console.log("📝 Property data received:", data);

      // Validate required fields based on your new model
      if (!data.title || !data.description || !data.rent || !data.address) {
        return NextResponse.json(
          {
            error: "Missing required fields: title, description, rent, address",
          },
          { status: 400 }
        );
      }

      // Handle incoming image URLs from the frontend upload
      let validImages: string[] = [];
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
        validImages = data.images.filter(
          (url) => typeof url === "string" && urlRegex.test(url)
        );
      }

      // If no valid images were provided after filtering, use a placeholder
      if (validImages.length === 0) {
        validImages = [
          "https://via.placeholder.com/400x300?text=Property+Image",
        ];
      }

      // Construct the data object to perfectly match your new Property model
      const propertyData = {
        landlordId: userId,
        title: data.title,
        description: data.description,
        address: {
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.zipCode,
          country: data.address.country || "India",
        },
        propertyType: data.propertyType,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        squareFootage: data.squareFootage,
        rent: {
          amount: data.rent.amount,
          currency: data.rent.currency || "INR",
          period: data.rent.period || "monthly",
        },
        securityDeposit: data.securityDeposit,
        amenities: data.amenities || [],
        features: {
          parking: data.features?.parking || false,
          gym: data.features?.gym || false,
          pool: data.features?.pool || false,
          laundry: data.features?.laundry || false,
          airConditioning: data.features?.airConditioning || false,
          heating: data.features?.heating || false,
          internet: data.features?.internet || false,
          furnished: data.features?.furnished || false,
          balcony: data.features?.balcony || false,
          garden: data.features?.garden || false,
        },
        images: validImages,
        status: data.status || "available",
        leaseTerms: {
          minimumTerm: data.leaseTerms?.minimumTerm || 12,
          maximumTerm: data.leaseTerms?.maximumTerm || 12,
          petsAllowed: data.leaseTerms?.petsAllowed || false,
          smokingAllowed: data.leaseTerms?.smokingAllowed || false,
          maxOccupants: data.leaseTerms?.maxOccupants,
          depositRequired: data.leaseTerms?.depositRequired || true,
        },
        utilities: {
          includedInRent: data.utilities?.includedInRent || [],
          tenantResponsible: data.utilities?.tenantResponsible || [],
        },
        availableFrom: data.availableFrom
          ? new Date(data.availableFrom)
          : new Date(),
        lastUpdated: new Date(),
      };

      console.log("💾 Property data structure (for new model):", {
        landlordId: propertyData.landlordId,
        title: propertyData.title,
        rent: propertyData.rent,
        features: propertyData.features,
        status: propertyData.status,
        address: propertyData.address,
      });

      // Create new property
      const property = new Property(propertyData);
      await property.save();

      console.log("✅ Property created successfully:", property._id);

      return NextResponse.json(
        {
          success: true,
          message: "Property created successfully",
          property,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("❌ Error creating property:", error);

      if (error.name === "ValidationError") {
        const validationErrors = Object.keys(error.errors).map((key) => ({
          field: key,
          message: error.errors[key].message,
        }));
        console.log("❌ Validation errors:", validationErrors);
        return NextResponse.json(
          { error: "Validation failed", details: validationErrors },
          { status: 400 }
        );
      }

      console.error("❌ Unexpected error:", error.message);
      return NextResponse.json(
        {
          error: "An error occurred while creating the property",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
);
