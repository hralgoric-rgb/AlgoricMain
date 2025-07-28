  import { NextResponse , NextRequest } from "next/server";
  import UtilityBill from "@/app/(microestate)/models/Utility";
  import dbConnect from "@/app/(microestate)/lib/db";
  import { getServerSession } from "next-auth";
  import { authOptions } from "../../auth/[...nextauth]/options";


  // for getting the whole bill details
  export async function GET(_request: NextRequest , {params}: {params: {BillId: string}}) {
    try {

      await dbConnect()

        const session = await getServerSession(authOptions);

          if (!session || !session.user) {
              return NextResponse.json({
                  message: "Unauthorized"
              }, {status: 401});
          }
    
          const bill = await UtilityBill.findById(params.BillId)
         
          if (!bill) {
            return NextResponse.json({
        message: "Bill not found "
      } , {status: 401})
          }

          return NextResponse.json({
            message: "Bill Found Sucessfully",
            bill
          } , {status: 201})
      
    } catch (error) {
      console.log("Error  While Getting Details " , error)
      return NextResponse.json({
        message: "Error while Getting details "
      } , {status: 500})
    }
  }



  // for deleting the bill

  export async function DELETE(_request: NextRequest  , {params}: {params: {billId: string}}) {
      try {
          await dbConnect()
    const session = await getServerSession(authOptions);

          if (!session || !session.user) {
              return NextResponse.json({
                  message: "Unauthorized"
              }, {status: 401});
          }

        if ( session.user.role === "tentant") {
          return NextResponse.json({
            message: "Only Landloard are allowed to Delete Thier Bills "
          } , {status: 400})
        }
        
        
     const bill = await UtilityBill.findById(params.billId);
    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

   // ensure the owner only deletes the bill  
    if (bill.landlordId.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden: You do not own this bill" },
        { status: 403 }
      );
    }

    await UtilityBill.findByIdAndDelete(params.billId);
    return NextResponse.json({ message: "Bill deleted successfully" }, { status: 200 });

      } catch (error) {
          console.log("Error while Deleting Bill" , error)
          return NextResponse.json({
              message: "Error while Deleting "
          } , {status: 500})
      }
  }


  // editing the bill details 
  export async function PUT(request: NextRequest , {params}: {params: {BillId: string}}) {
    
    try {
      await dbConnect()

          const session = await getServerSession(authOptions);

          if (!session || !session.user) {
              return NextResponse.json({
                  message: "Unauthorized"
              }, {status: 401});
          }

  if ( session.user.role === "tentant") {
          return NextResponse.json({
            message: "Only Landloard are allowed to Update  Thier Bills "
          } , {status: 400})
        }

     const bill = await UtilityBill.findById(params.BillId);
    if (!bill) {
      return NextResponse.json(
        { message: "Bill not found" }, 
        { status: 404 });
    }

    // ensure only owner can Edit thier bills 
    if (bill.landlordId.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden: You do not own this bill" },
        { status: 403 }
      );
    }

   const data = await request.json();
    if (!data) {
      return NextResponse.json({ message: "No data provided" }, { status: 400 });
    }

    const updatedBill = await UtilityBill.findByIdAndUpdate(params.BillId, data, { new: true });

    return NextResponse.json({
       message: "Bill updated successfully", updatedBill
       } , {status: 200});

    } catch (error) {
      console.log("Error while Editing Bill Detais" ,  error)
      return NextResponse.json({
        message: "Error while Editing "
      } , {status: 500})
    }
  }
