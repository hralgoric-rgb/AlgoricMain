import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import UtilityBill from "@/app/(microestate)/models/Utility";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";

// for lanlords to see the ss of payment

export const GET = requireLandlord(
    async(_request: NextRequest , context: any) => {
        try {
            await dbConnect()
           const BillId = context.params.BillId

        const bill =  await UtilityBill.findById(BillId)
        if (!bill) {
            return NextResponse.json({
                message: "Bill not found!"
            } , {status: 400})
        }

        if (!bill.paymentProof?.url) {
      return NextResponse.json({
         message: "No payment proof uploaded yet" },
          { status: 404 });
    }

    return NextResponse.json({
      paymentProofUrl: bill.paymentProof.url,
      uploadedAt: bill.paymentProof.uploadedAt,
      status: bill.status,
    });


        } catch (error) {
            console.log("Error while Getting payment status" , error)
            return NextResponse.json({
                message: "Error while geting status"
            } , {status: 500})
        }
    }
)