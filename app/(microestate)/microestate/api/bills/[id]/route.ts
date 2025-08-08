  import { NextResponse , NextRequest } from "next/server";
  import UtilityBill from "@/app/(microestate)/models/Utility";
  import dbConnect from "@/app/(microestate)/lib/db";
  import { getServerSession } from "next-auth";
  import { authOptions } from "../../auth/[...nextauth]/options";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";


  // for getting the whole bill details
  // does not requireLandlord 
  export async function GET(_request: NextRequest , {params}: {params: {id: string}}) {
    try {

      await dbConnect()

        const session = await getServerSession(authOptions);

          if (!session || !session.user) {
              return NextResponse.json({
                  message: "Unauthorized"
              }, {status: 401});
          }
    
          const bill = await UtilityBill.findById(params.id)
         
          if (!bill) {
            return NextResponse.json({
        message: "Bill not found "
      } , {status: 404})
          }

          return NextResponse.json({
            message: "Bill Found Successfully",
            bill
          } , {status: 200})
      
    } catch (error) {
      console.log("Error  While Getting Details " , error)
      return NextResponse.json({
        message: "Error while Getting details "
      } , {status: 500})
    }
  }



  // for deleting the bill

  export const DELETE = requireLandlord(
  async (request: NextRequest, user: any) => {
    try {
      await dbConnect();

      // Extract bill ID from URL path
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const billId = pathParts[pathParts.length - 1]; // Get the last part of the path
      
      console.log('Delete bill request:', { url: request.url, billId, pathParts });
      
      const userId = user.userId;

      if (!billId) {
        return NextResponse.json({ message: "Bill ID is required" }, { status: 400 });
      }

      const bill = await UtilityBill.findById(billId);

      if (!bill) {
        return NextResponse.json({ message: "Bill not found" }, { status: 404 });
      }

      if (bill.landlordId.toString() !== userId) {
        return NextResponse.json(
          { message: "You are not authorized to delete this bill" },
          { status: 403 }
        );
      }

      await bill.deleteOne();

      return NextResponse.json({ message: "Bill deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error while deleting bill:", error);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }
);


  // editing the bill details 

export const PUT = requireLandlord(
  async (request: NextRequest, user: any) => {
    try {
      await dbConnect();

      // Extract bill ID from URL path
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const billId = pathParts[pathParts.length - 1]; // Get the last part of the path
      
      const userId = user.userId;

      if (!billId) {
        return NextResponse.json({ message: "Bill ID is required" }, { status: 400 });
      }

      const bill = await UtilityBill.findById(billId);

      if (!bill) {
        return NextResponse.json({ message: "Bill not found" }, { status: 404 });
      }

      // ✅ Ensure only the owner landlord can update
      if (bill.landlordId.toString() !== userId) {
        return NextResponse.json(
          { message: "Forbidden: You do not own this bill" },
          { status: 403 }
        );
      }

      const data = await request.json();
      
    if (!data) {
      return NextResponse.json(
          { message: "data is required!" },
          { status: 400 }
        );
    }
       
      const updatedBill = await UtilityBill.findByIdAndUpdate(billId, data, {
        new: true,
           });

      return NextResponse.json(
        {
          message: "Bill updated successfully",
          updatedBill,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error while updating bill:", error);
      return NextResponse.json(
        { message: "Server error while updating bill" },
        { status: 500 }
      );
    }
  }
);
