import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import UtilityBill from "@/app/(microestate)/models/Utility";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";


export async function POST(_request: NextRequest , {params}: {params: {BillId: string}}) {
    try {
        await dbConnect()
         const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bill = await UtilityBill.findById(params.BillId);
    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    if (bill.status === "paid") {
        return NextResponse.json({
            message: "Already Paid the Bill"
        } , {status: 200})
    }

    const paidBill =  bill.markAsPaid()
    await bill.save()

  return NextResponse.json({
            message: "Bill paid sucessfully",
            paidBill
        } , {status: 200})


    } catch (error) {
        console.log("Error while paying the bill" , error)
        return NextResponse.json({
            message: "Error while paying the bill"
        } , {status: 500})
    }


}
