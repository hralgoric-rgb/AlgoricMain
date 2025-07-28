// updating payment status of the particular bill


import { NextResponse , NextRequest } from "next/server";
import UtilityBill from "@/app/(microestate)/models/Utility";
import dbConnect from "@/app/(microestate)/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";

// get status of the single bill 
export async function GET(_request: NextRequest , {params}: {params: {billId: string}} ) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({
                message: "Unauthorized"
            }, {status: 401});
        }

        const billId = params.billId
        if (!billId) {
                return NextResponse.json({
                message: "Bill Id Is required!"
            }, {status: 401});
        }

         const FoundBillID = await UtilityBill.findById(billId)
        if (!FoundBillID) {
            return  NextResponse.json({
                message: "Bill not found in our database"
            } , {status: 400})
        }
           return NextResponse.json({ status: FoundBillID.status }, { status: 200 });

    } catch (error) {
        console.log("Error while getting the bill status", error);
        return NextResponse.json({
            message: "Error occurred while getting the bill status"
        }, {status: 500});
    }
}


// change the status of the bill 
export async function PATCH(request: NextRequest , {params}: {params: {billId: string}}) {
    try {
        await dbConnect()

        const {status} = await request.json()
        if (!status) {
             return NextResponse.json({
            message: "Status is required!"
        } , {status: 400})
        }

     
         const updatedBill = await UtilityBill.findByIdAndUpdate(
            params.billId,
            { status },
            { new: true }
        );
        return NextResponse.json({
            message: "Bill status Updated Sucessfully",
            updatedBill
        } , {status: 200})


    } catch (error) {
         console.log("Error while Editing Bill" , error)
        return NextResponse.json({
            message: "Error while Editing "
        } , {status: 500})
    }

}