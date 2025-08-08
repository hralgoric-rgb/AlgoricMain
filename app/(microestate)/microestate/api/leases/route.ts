import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import Lease from "@/app/(microestate)/models/Lease";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";

// Get all leases for a landlord
export const GET = requireLandlord(
  async (_request: NextRequest, context: { userId: string; userRole: string; userEmail: string }) => {
    try {
      await dbConnect();
      
      const landlordId = context.userId;
      
      const leases = await Lease.find({ landlordId })
        .populate("propertyId", "title address")
        .populate("tenantId", "firstName lastName email")
        .sort({ createdAt: -1 }); // Sort by newest first

      return NextResponse.json({
        message: "Leases found successfully",
        leases
      }, { status: 200 });

    } catch (error) {
      console.log("Error while getting leases", error);
      return NextResponse.json({
        message: "Error occurred while fetching leases"
      }, { status: 500 });
    }
  }
);
