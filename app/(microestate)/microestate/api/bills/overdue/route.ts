import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import UtilityBill from "@/app/(microestate)/models/Utility";
import { requireLandlord } from "@/app/(microestate)/lib/authorize";

// require Landlord
// ulitily model 

export const GET = requireLandlord(
  async (_request: NextRequest, context: { userId: string }) => {
    try {
      await dbConnect();

      const landlordId = context.userId;

      const overdueBills = await UtilityBill.find({
        landlordId,
        status: "overdue",
        dueDate: { $lt: new Date() },
      }).populate("propertyId tenantId");

      return NextResponse.json(
        {
          message: "Overdue bills fetched successfully",
          count: overdueBills.length,
          bills: overdueBills,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error while finding overdue bills", error);
      return NextResponse.json(
        { message: "Error while finding overdue bills" },
        { status: 500 }
      );
    }
  }
<<<<<<< HEAD
);
=======
);
>>>>>>> Priya
