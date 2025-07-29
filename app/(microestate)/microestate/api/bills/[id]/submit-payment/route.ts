import { NextResponse , NextRequest } from "next/server";
import UtilityBill from "@/app/(microestate)/models/Utility";
import dbConnect from "@/app/(microestate)/lib/db";
import { requireTenant } from "@/app/(microestate)/lib/authorize";
import { uploadToImageKit } from "@/app/(microestate)/lib/ImageUpload";


export const POST = requireTenant(
    async (request: NextRequest , context: any) => {
        try {
            await dbConnect()

            const userId = context.userId
           const billID = context.params.BillId

            const formdata = await request.formData()
            const file = formdata.get("File") as File
           
    

            if (!file) {
                return NextResponse.json({
                    message: "Error file Scrrenshot is requried@"
                },  {status: 401})
            }


            const bill = await UtilityBill.findById(billID)
            if (!bill) {
                return   NextResponse.json(
          { message: "Bill not found" },
          { status: 404 }
        );
          }

           // Check tenant owns the bill
          if (bill.tenantId !== userId) {
             return NextResponse.json({
                message: "You are not authorized to submit payment for the bill"
             } , {status: 404})
          }

          const ImageUrl =  await uploadToImageKit(file)

       const billstatus =  bill.status = "pending"

         bill.paymentProof = {
            url: ImageUrl,
            uploadedAt: new Date()
         }

          return NextResponse.json({
            message: "file uploaded Sucessfully Wait Until Landlord approves it",
            userId,
            ImageUrl,
            billstatus
          })
            
        } catch (error) {
            console.log("Error while uploading image" , error)
            return NextResponse.json({
                message: "Error while uploading ss "
            } , {status: 500})
        }
    }
)
