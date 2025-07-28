import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import UtilityBill from "@/app/(microestate)/models/Utility";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST( _request: NextRequest) {
    try {
        await dbConnect()

         const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const OverDueBills = await UtilityBill.findOverdueBills()

      return NextResponse.json(
      {
        message: "Overdue bills fetched successfully",
        count: OverDueBills.length,
        bills: OverDueBills,
      },
      { status: 200 }
    );
        
    } catch (error) {
        console.log("Error while Finding Overdue Bills" , error)
        return NextResponse.json({
            message: "Error while finding OverDue BIlls"
        } , {status: 500})
    }
}