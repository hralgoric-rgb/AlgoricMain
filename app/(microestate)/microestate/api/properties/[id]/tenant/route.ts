import { requireLandlord } from "@/app/(microestate)/lib/authorize";
import dbConnect from "@/app/(microestate)/lib/db";
import mongoose from "mongoose";
import Lease, { ILease } from "@/app/(microestate)/models/Lease";
import { NextRequest, NextResponse } from "next/server";
import Property from "@/app/(microestate)/models/Property";
import User from "@/app/(microestate)/models/user";
import {
  getTenantWelcomeEmailTemplate,
  sendEmail,
} from "@/app/(microestate)/lib/utils";

// Request body interface
interface AddTenantRequest {
  tenantEmail: string;
  tenantFirstName?: string;
  tenantLastName?: string;
  tenantPhone?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate?: number;
  terms: string;
}

// POST method to add a tenant to a property
export const POST = requireLandlord(
  async (
    request: NextRequest,
    context: { params: { id: string }; userId: string; userEmail: string }
  ) => {
    try {
      await dbConnect();

      // 1. FIX: Get propertyId and userId from the context object
      const { id: propertyId } = context.params;
      const { userId, userEmail } = context;

      if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
        return NextResponse.json(
          { success: false, message: "Invalid property ID provided" },
          { status: 400 }
        );
      }

      // Parse request body
      const body = await request.json();
      const {
        tenantEmail,
        tenantFirstName,
        tenantLastName,
        tenantPhone,
        startDate,
        endDate,
        monthlyRent,
        securityDeposit,
        rentDueDate = 1,
        terms,
      } = body;

      // Validate required fields
      if (
        !tenantEmail ||
        !startDate ||
        !endDate ||
        !monthlyRent ||
        !securityDeposit ||
        !terms
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Missing required fields. Please provide tenantEmail, startDate, endDate, monthlyRent, securityDeposit, and terms.",
          },
          { status: 400 }
        );
      }

      const leaseStartDate = new Date(startDate);
      const leaseEndDate = new Date(endDate);

      if (isNaN(leaseStartDate.getTime()) || isNaN(leaseEndDate.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid date format." },
          { status: 400 }
        );
      }

      if (leaseStartDate >= leaseEndDate) {
        return NextResponse.json(
          { success: false, message: "End date must be after start date." },
          { status: 400 }
        );
      }

      // Check if property exists and belongs to the landlord
      const property = await Property.findOne({
        _id: propertyId,
        landlordId: userId, // Use the correctly extracted userId
      });

      if (!property) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Property not found or you do not have permission to manage this property.",
          },
          { status: 404 }
        );
      }

      if (property.status !== "available") {
        return NextResponse.json(
          {
            success: false,
            message: `Property is currently ${property.status} and cannot have a new tenant assigned.`,
          },
          { status: 400 }
        );
      }

      // Find tenant by email
      let tenant = await User.findOne({
        email: tenantEmail.toLowerCase().trim(),
      });

      let isNewTenant = false;
      const generatedPassword = Math.random().toString(36).slice(-8); // Generate a random password

      if (!tenant) {
        // 2. FIX: Set isNewTenant to true when creating a new user
        isNewTenant = true;
        tenant = new User({
          email: tenantEmail.toLowerCase().trim(),
          password: generatedPassword, // Use the generated password
          firstName: tenantFirstName || "New",
          lastName: tenantLastName || "Tenant",
          phone: tenantPhone || "000-000-0000",
          role: "tenant",
        });
        await tenant.save();
      } else {
        if (tenant.role !== "tenant") {
          return NextResponse.json(
            {
              success: false,
              message:
                "User exists but is not registered as a tenant. Please use a different email.",
            },
            { status: 400 }
          );
        }
      }

      // Check if tenant already has an active lease for this property
      const existingLease = await Lease.findOne({
        propertyId,
        tenantId: tenant._id,
        status: { $in: ["active", "draft"] },
      });

      if (existingLease) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Tenant already has an active or draft lease for this property.",
          },
          { status: 400 }
        );
      }

      // Create new lease agreement
      const newLease = new Lease({
        propertyId,
        landlordId: userId,
        tenantId: tenant._id,
        startDate: leaseStartDate,
        endDate: leaseEndDate,
        monthlyRent,
        securityDeposit,
        rentDueDate,
        terms,
        status: "draft",
      });

      await newLease.save();

      // Update property status to rented
      property.status = "rented";
      await property.save();

      // Send welcome email to new tenant
      if (isNewTenant) {
        try {
          const data = {
            tenantEmail: tenant.email,
            tenantName: `${tenant.firstName} ${tenant.lastName}`,
            password: generatedPassword,
            propertyTitle: property.title,
            propertyAddress: `${property.address.street}, ${property.address.city}`,
            landlordEmail: userEmail,
            leaseStartDate: leaseStartDate.toLocaleDateString(),
            monthlyRent: monthlyRent,
          };
          const emailTemplate = getTenantWelcomeEmailTemplate(data);
          await sendEmail(
            tenant.email,
            `Welcome to ${property.title}`,
            emailTemplate
          );
          console.log(`Welcome email sent to ${tenant.email}`);
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }
      }

      // Populate the lease with tenant and property details for response
      const populatedLease = await Lease.findById(newLease._id)
        .populate("tenantId", "firstName lastName email phone")
        .populate("propertyId", "title address");

      return NextResponse.json(
        {
          success: true,
          message: isNewTenant
            ? "New tenant account created and added to property. Welcome email sent."
            : "Existing tenant successfully added to property.",
          data: { lease: populatedLease, isNewTenant },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error in POST /api/properties/[id]/tenant:", error);
      // Handle specific MongoDB errors
      if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation error",
            error: Object.values(error.errors)
              .map((err) => err.message)
              .join(", "),
          },
          { status: 400 }
        );
      }

      if (error instanceof mongoose.Error.CastError) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid data format provided",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "An error occurred while adding tenant",
        },
        { status: 500 }
      );
    }
  }
);

// GET method to retrieve current tenant(s) for a property
export const GET = requireLandlord(
  async (
    request: NextRequest,
    context: { params: { id: string }; userId: string }
  ) => {
    try {
      await dbConnect();
      // 3. FIX: Standardize how params and userId are received
      const { id: propertyId } = context.params;
      const { userId } = context;

      if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
        return NextResponse.json(
          { success: false, message: "Invalid property ID" },
          { status: 400 }
        );
      }

      const property = await Property.findOne({
        _id: propertyId,
        landlordId: userId,
      });
      if (!property) {
        return NextResponse.json(
          {
            success: false,
            message: "Property not found or permission denied",
          },
          { status: 404 }
        );
      }

      const leases = await Lease.find({
        propertyId,
        status: { $in: ["active", "draft"] },
      }).populate("tenantId", "firstName lastName email phone");

      if (!leases || leases.length === 0) {
        return NextResponse.json(
          { success: true, message: "No current tenants found.", data: [] },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Tenants retrieved successfully.",
          data: leases,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in GET /api/properties/[id]/tenant:", error);
      return NextResponse.json(
        { success: false, message: "Server error" },
        { status: 500 }
      );
    }
  }
);

// DELETE method to remove tenant from property (terminate lease)
export const DELETE = requireLandlord(
  async (
    request: NextRequest,
    context: { params: { id: string }; userId: string }
  ) => {
    try {
      await dbConnect();
      // 4. FIX: Standardize how params and userId are received
      const { id: propertyId } = context.params;
      const { userId } = context;
      const { leaseId } = await request.json(); // Expect leaseId in the body to know which lease to terminate

      if (
        !propertyId ||
        !mongoose.Types.ObjectId.isValid(propertyId) ||
        !leaseId ||
        !mongoose.Types.ObjectId.isValid(leaseId)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid property or lease ID" },
          { status: 400 }
        );
      }

      const property = await Property.findOne({
        _id: propertyId,
        landlordId: userId,
      });
      if (!property) {
        return NextResponse.json(
          {
            success: false,
            message: "Property not found or permission denied",
          },
          { status: 404 }
        );
      }

      const leaseToTerminate = await Lease.findOne({
        _id: leaseId,
        propertyId,
      });
      if (!leaseToTerminate) {
        return NextResponse.json(
          { success: false, message: "Lease not found for this property" },
          { status: 404 }
        );
      }

      leaseToTerminate.status = "terminated";
      await leaseToTerminate.save();

      // Check if any other active leases exist for this property
      const otherActiveLeases = await Lease.countDocuments({
        propertyId,
        status: "active",
      });
      if (otherActiveLeases === 0) {
        property.status = "available";
        await property.save();
      }

      return NextResponse.json(
        { success: true, message: "Lease terminated successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in DELETE /api/properties/[id]/tenant:", error);
      return NextResponse.json(
        { success: false, message: "Server error" },
        { status: 500 }
      );
    }
  }
);
