import { requireLandlord } from "@/app/(microestate)/middleware/auth";
import dbConnect from "@/app/(microestate)/lib/db";
import mongoose from "mongoose";
import Lease from "@/app/(microestate)/models/Lease";
import { NextRequest, NextResponse } from "next/server";
import Property from "@/app/(microestate)/models/Property";
import MicroestateUser from "@/app/(microestate)/models/user";
import { getTenantWelcomeEmailTemplate, sendEmail } from "@/app/(microestate)/lib/utils";

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

//POST method to add a tenant to a property
// This will create a new lease agreement and send a welcome email to the tenant
export const POST = requireLandlord(async (request: NextRequest, context:{ userId: string; userEmail: string }) => {
  try {
    await dbConnect();

    const {userId, userEmail} = context;

    const url = new URL(request.url);
    const propertyId = url.pathname.split("/")[4]; 

    // Parse request body
    const body: AddTenantRequest = await request.json();
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
      terms 
    } = body;

     // Validate required fields
    if (!tenantEmail || !startDate || !endDate || !monthlyRent || !securityDeposit || !terms) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields. Please provide tenantEmail, startDate, endDate, monthlyRent, securityDeposit, and terms.'
        },
        { status: 400 }
      );
    }

    // Validate dates
    const leaseStartDate = new Date(startDate);
    const leaseEndDate = new Date(endDate);
    const currentDate = new Date();

    if (isNaN(leaseStartDate.getTime()) || isNaN(leaseEndDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid date format. Please use ISO date format (YYYY-MM-DD).'
        },
        { status: 400 }
      );
    }

    if (leaseStartDate >= leaseEndDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'End date must be after start date.'
        },
        { status: 400 }
      );
    }

    // Check if property exists and belongs to the landlord
    const property = await Property.findOne({ 
      _id: propertyId, 
      landlordId: userId.userId 
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          message: 'Property not found or you do not have permission to manage this property.'
        },
        { status: 404 }
      );
    }

    // Check if property is available
    if (property.status !== 'available') {
      return NextResponse.json(
        {
          success: false,
          message: `Property is currently ${property.status} and cannot have a new tenant assigned.`
        },
        { status: 400 }
      );
    }

    // Find tenant by email
    let tenant = await MicroestateUser.findOne({ 
      email: tenantEmail.toLowerCase().trim(),
      role: 'tenant'
    });

    let isNewTenant = false;
    let generatedPassword = '123456'; // Default password for new tenants

    //if not the create a new tenant
    if (!tenant) {
      tenant = new MicroestateUser({
        email: tenantEmail.toLowerCase().trim(),
        password: generatedPassword,
        firstName: tenantFirstName || "New",
        lastName: tenantLastName || "Tenant",
        phone: tenantPhone || "000-000-0000",
        role: "tenant",
      })

      await tenant.save();
    }
    else {
      // Check if existing user is not a tenant
      if (tenant.role !== 'tenant') {
        return NextResponse.json(
          {
            success: false,
            message: 'User exists but is not registered as a tenant. Please ask them to update their role or use a different email.'
          },
          { status: 400 }
        );}
    }

    // Check if tenant already has an active lease for this property
      const existingLease = await Lease.findOne({
        propertyId,
        tenantId: tenant._id,
        status: { $in: ['active', 'draft'] }
      });

      if (existingLease) {
        return NextResponse.json(
          {
            success: false,
            message: 'Tenant already has an active or draft lease for this property.'
          },
          { status: 400 }
        );
      }
    
       // Create new lease agreement
    const newLease = new Lease({
      propertyId,
      landlordId: userId.userId,
      tenantId: tenant._id,
      startDate: leaseStartDate,
      endDate: leaseEndDate,
      monthlyRent,
      securityDeposit,
      rentDueDate,
      terms,
      status: 'draft'
    });

    await newLease.save();

    // Update property status to rented
    property.status = 'rented';
    await property.save();

    // Send welcome email to new tenant
    if (isNewTenant) {
      try {
        const data = {
          tenantEmail: tenant.email,
          tenantName: `${tenant.firstName} ${tenant.lastName}`,
          password: generatedPassword,
          propertyTitle: property.title,
          propertyAddress: property.getFullAddress(),
          landlordEmail: String(userEmail) || '', // You might want to get landlord name
          leaseStartDate: leaseStartDate.toLocaleDateString(),
          monthlyRent: monthlyRent
        }

        const emailTemplate = getTenantWelcomeEmailTemplate(data);

        await sendEmail(tenant.email, `Welcome to ${property.title}`, emailTemplate);

        console.log(`Welcome email sent to ${tenant.email}`);
        
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the entire operation if email fails
      }
    }

    // Populate the lease with tenant and property details for response
    const populatedLease = await Lease.findById(newLease._id)
      .populate('tenantId', 'firstName lastName email phone')
      .populate('propertyId', 'title address');

    return NextResponse.json(
      {
        success: true,
        message: isNewTenant 
          ? 'New tenant account created and added to property. Welcome email sent with login credentials.'
          : 'Existing tenant successfully added to property. Lease agreement created.',
        data: {
          lease: {
            _id: populatedLease!._id,
            propertyId: populatedLease!.propertyId,
            landlordId: populatedLease!.landlordId,
            tenant: populatedLease!.tenantId,
            startDate: populatedLease!.startDate,
            endDate: populatedLease!.endDate,
            monthlyRent: populatedLease!.monthlyRent,
            securityDeposit: populatedLease!.securityDeposit,
            rentDueDate: populatedLease!.rentDueDate,
            terms: populatedLease!.terms,
            status: populatedLease!.status,
            signatures: populatedLease!.signatures,
            createdAt: populatedLease!.createdAt
          },
          property: {
            _id: property._id,
            title: property.title,
            status: property.status
          },
          isNewTenant,
          ...(isNewTenant ? { 
            temporaryPassword: generatedPassword // Include in response for testing/demo
          } : {})
        }
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
        message: "An error occurred while adding tenant to property",
      },
      { status: 500 }
    );
  }
});


// GET method to retrieve current tenant for a property
export const GET = requireLandlord(async (request: NextRequest, { userId }: { userId: string }) => {
  try {
    await dbConnect();

    // Get property ID from URL params
    const url = new URL(request.url);
    const propertyId = url.pathname.split('/')[4];

    // if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
    //   return NextResponse.json(
    //     { 
    //       success: false, 
    //       message: 'Invalid property ID provided' 
    //     },
    //     { status: 400 }
    //   );
    // }

    // Check if property belongs to the landlord
    const property = await Property.findOne({ 
      _id: propertyId, 
      landlordId: userId 
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          message: 'Property not found or you do not have permission to view this property.'
        },
        { status: 404 }
      );
    }

    // Find current active lease for the property
    const currentLease = await Lease.findOne({
      propertyId,
      status: { $in: ['active', 'draft'] }
    })
    .populate('tenantId', 'firstName lastName email phone profileImage')
    .populate('propertyId', 'title address');

    if (!currentLease) {
      return NextResponse.json(
        {
          success: true,
          message: 'No current tenant found for this property.',
          data: {
            tenant: null,
            lease: null
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Current tenant information retrieved successfully.',
        data: {
          tenant: currentLease.tenantId,
          lease: {
            _id: currentLease._id,
            startDate: currentLease.startDate,
            endDate: currentLease.endDate,
            monthlyRent: currentLease.monthlyRent,
            securityDeposit: currentLease.securityDeposit,
            rentDueDate: currentLease.rentDueDate,
            status: currentLease.status,
            signatures: currentLease.signatures,
            remainingDays: currentLease.getRemainingDays(),
            isFullySigned: currentLease.isFullySigned()
          }
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in GET /api/properties/[id]/tenant:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'An error occurred while retrieving tenant information'
      },
      { status: 500 }
    );
  }
});

// DELETE method to remove tenant from property (terminate lease)
export const DELETE = requireLandlord(async (request: NextRequest, { userId }: { userId: string }) => {
  try {
    await dbConnect();

    // Get property ID from URL params
    const url = new URL(request.url);
    const propertyId = url.pathname.split('/')[4];

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid property ID provided' 
        },
        { status: 400 }
      );
    }

    // Check if property belongs to the landlord
    const property = await Property.findOne({ 
      _id: propertyId, 
      landlordId: userId 
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          message: 'Property not found or you do not have permission to manage this property.'
        },
        { status: 404 }
      );
    }

    // Find and terminate the active lease
    const activeLease = await Lease.findOne({
      propertyId,
      status: { $in: ['active', 'draft'] }
    });

    if (!activeLease) {
      return NextResponse.json(
        {
          success: false,
          message: 'No active lease found for this property.'
        },
        { status: 404 }
      );
    }

    // Terminate the lease
    activeLease.status = 'terminated';
    await activeLease.save();

    // Update property status to available
    property.status = 'available';
    await property.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Tenant successfully removed from property. Lease terminated.',
        data: {
          lease: {
            _id: activeLease._id,
            status: activeLease.status
          },
          property: {
            _id: property._id,
            status: property.status
          }
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in DELETE /api/properties/[id]/tenant:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'An error occurred while removing tenant from property'
      },
      { status: 500 }
    );
  }
});
