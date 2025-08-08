// get all bills and Create Bills 

import { NextResponse , NextRequest } from "next/server";
import UtilityBill from "@/app/(microestate)/models/Utility";
import dbConnect from "@/app/(microestate)/lib/db";
import MicroestateUser from "@/app/(microestate)/models/user";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";
import Lease from "@/app/(microestate)/models/Lease";

// get all bills for a specific landlord
export const GET = requireLandlord(
  async (_request: NextRequest, context: { userId: string; userRole: string; userEmail: string }) => {
    try {
      await dbConnect();
      
      const landlordId = context.userId;
      
      const bills = await UtilityBill.find({ landlordId })
        .populate("propertyId", "title address")
        .populate("landlordId", "name")
        .populate("tenantId", "firstName lastName")
        .sort({ createdAt: -1 }); // Sort by newest first

      return NextResponse.json({
        message: "Bills Found",
        bills
      }, { status: 200 });

    } catch (error) {
      console.log("Error while Getting all the bills", error);
      return NextResponse.json({
        message: "Error occurred while fetching bills"
      }, { status: 500 });
    }
  }
);

// create bill

// check if the user is login as  landlord or not only allow if the user is landlord 
// find the user(landloard) in  database 
// find the property which the user(landloard) has owned 
// find tentant which has assigned to it if not return  error respone 
// create a bill for bill type  ,  amount , billingPeriod , end , dueDate , status  from landloard from request.json
// add that bill in Utility for that tentant and return response 


// requiredLandlord 
// property id from lease model
// take propertyId from frontend (params/url)
// add bill

export const POST = requireLandlord(
  async (request: NextRequest, context: { userId: string; userRole: string; userEmail: string }) => {
    try {
      await dbConnect();

      const {
        utilityType,
        amount,
        billingPeriod,
        dueDate,
        responsibleParty,
        tenantId, // Specific tenant selection
        billDocument,
        notes,
        propertyId, // Optional: allow frontend to specify which property
      } = await request.json();

      if (!utilityType || !amount || !billingPeriod || !dueDate || !responsibleParty) {
        return NextResponse.json(
          { message: "All fields are required!" },
          { status: 400 }
        );
      }

      const landlordId = context.userId;

      const foundUser = await MicroestateUser.findById(landlordId);
      if (!foundUser) {
        return NextResponse.json(
          { message: "User does not exist in our database" },
          { status: 400 }
        );
      }

      let activeLease;
      let selectedTenant = null;

      if (tenantId) {
        // If a specific tenant is selected, find the lease for that tenant
        activeLease = await Lease.findOne({ 
          landlordId: landlordId,
          tenantId: tenantId,
          status: "active"
        }).populate("propertyId tenantId");
        
        if (!activeLease) {
          return NextResponse.json(
            { message: "No active lease found for the selected tenant." },
            { status: 400 }
          );
        }
        selectedTenant = activeLease.tenantId;
      } else if (propertyId) {
        // If a specific property is provided, find lease for that property
        activeLease = await Lease.findOne({ 
          landlordId: landlordId,
          propertyId: propertyId,
          status: "active"
        }).populate("propertyId tenantId");
      } else {
        // Otherwise, find any active lease for this landlord
        activeLease = await Lease.findOne({ 
          landlordId: landlordId,
          status: "active"
        }).populate("propertyId tenantId");
      }

      if (!activeLease) {
        return NextResponse.json(
          { message: "No active lease found. You need to have an active lease with a tenant to create bills." },
          { status: 400 }
        );
      }

      // Use selected tenant or fallback to lease tenant
      const finalTenant = selectedTenant || activeLease.tenantId;

      // Check if we need a tenant for this bill
      if (responsibleParty === "tenant" && !finalTenant) {
        return NextResponse.json(
          { message: "No tenant assigned to this lease. Bills for tenant responsibility require an active tenant." },
          { status: 400 }
        );
      }

      const newBill = await UtilityBill.create({
        propertyId: activeLease.propertyId,
        landlordId: landlordId,
        tenantId: finalTenant,
        utilityType,
        amount,
        billingPeriod: {
          start: new Date(billingPeriod.start),
          end: new Date(billingPeriod.end),
        },
        dueDate: new Date(dueDate),
        status: "pending",
        responsibleParty,
        billDocument,
        notes,
      });

      await newBill.save();

      // Populate the response for better frontend handling
      const populatedBill = await UtilityBill.findById(newBill._id)
        .populate("propertyId", "title address")
        .populate("tenantId", "firstName lastName");

      return NextResponse.json(
        {
          message: "Bill Created Successfully",
          bill: populatedBill,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error while Creating Bill", error);
      return NextResponse.json(
        { message: "Error while creating bill" },
        { status: 500 }
      );
    }
  }
);
