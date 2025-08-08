import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import UtilityBill from "@/app/(microestate)/models/Utility";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";


// mark as paid bill required Landlord!!

export const POST = requireLandlord(
    async (request: NextRequest , user: any) => {
        try {
            await dbConnect()
            
            // Extract bill ID from URL path
            const url = new URL(request.url);
            const pathParts = url.pathname.split('/');
            const billId = pathParts[pathParts.length - 2]; // Get bill ID (second to last part before "mark-as-paid")
            
            console.log('Mark as paid request:', { url: request.url, billId, pathParts });
            
            const userId = user.userId

            if (!billId) {
                return NextResponse.json({
                    message: "Bill ID is required"
                }, {status: 400})
            }
           
            const pendingBill = await UtilityBill.findById(billId)
            if (!pendingBill) {
                return NextResponse.json({
                    message: "Bill not found"
                } , {status: 404})
            }

            // Check if the landlord owns this bill
            if (pendingBill.landlordId.toString() !== userId) {
                return NextResponse.json({
                    message: "You are not authorized to mark this bill as paid"
                }, {status: 403})
            }
     
            if (pendingBill.status === "paid") {
                return NextResponse.json({
                    message: "Bill already paid"
                }, {status: 400})
            }

            // Mark as paid - update status and set paid date
            pendingBill.status = "paid"
            pendingBill.paidDate = new Date()
            await pendingBill.save()

            return NextResponse.json({
                message: "Bill marked as paid successfully",
                bill: pendingBill
            }, {status: 200})

        } catch (error) {
            console.log("Error while marking paid" , error)
            return NextResponse.json({
                message: "Error while marking paid"
            }, {status: 500})
        }
    }
)
