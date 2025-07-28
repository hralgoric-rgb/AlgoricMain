// get all bills and Create Bills 

import { NextResponse , NextRequest } from "next/server";
import UtilityBill from "@/app/(microestate)/models/Utility";
import dbConnect from "@/app/(microestate)/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/app/models/User";
import Property from "@/app/(microestate)/models/Property";


// get all bills
export async function GET(_request: NextRequest) {

    try {
        await dbConnect()
         
        const bills = await UtilityBill.find()
        .populate("propertyId" , "title address")
        .populate("landlordId" , "name ")
        .populate("TentantId" , "name")

        if (!bills) {
            return NextResponse.json({
            message: "No Bills Found"
        }, {status: 200})
        }

        return NextResponse.json({
            message: "Bills Found",
            bills
        }, {status: 200})


    } catch (error) {
        console.log("Error while Getting all the bills" , error)
        return NextResponse.json({
            message: "Error occcured"
        }, {status: 500})
    }
}

// create bill

// check if the user is login as  landlord or not only allow if the user is landlord 
// find the user(landloard) in  database 
// find the property which the user(landloard) has owned 
// find tentant which has assigned to it if not return  error respone 
// create a bill for bill type  ,  amount , billingPeriod , end , dueDate , status  from landloard from request.json
// add that bill in Utility for that tentant and return response 


// add bill

export async function POST(request: NextRequest) {
    
    try {
     await dbConnect()

    const {utilityType , amount , billingPeriod , dueDate , responsibleParty , billDocument , notes } = await request.json()

    if (!utilityType || !amount || !billingPeriod || !dueDate || !responsibleParty) {
        return NextResponse.json({
            message: "ALL fields are required!"
        } , {status: 404})
    }
      
     const session = await getServerSession(authOptions)
     if (!session) {
       return NextResponse.json({
            message: "Unauthorized"
        } , {status: 404})
     }

     if (session.user.role === "Tentant") {
        return NextResponse.json({
            message: "Only Landloards Can add bills"
        } , {status: 400})
     }

     const UserId = session.user.id 
     
     const FoundUser =  await User.findById(UserId)
     if (!FoundUser) {
         return NextResponse.json({
            message: "User does not exists in our database"
        } , {status: 400})
     }
     
     // finding the properties which is owned by landloard
     const property = await Property.findOne({landlordId: UserId}) // lanloard
     if (!property) {
        return NextResponse.json({
            message: "You Dont have any property"
        } , {status: 400})
     }
 
     //TODO: Check this on how to find Tentant Id
        const tenant = await User.findOne({
               role: "Tenant",  
          propertyId: property?._id,
          status: "active"
    });
    
 if (responsibleParty === "tenant" && !tenant) {
      return NextResponse.json(
        { message: "No active tenant assigned to this property" },
        { status: 400 }
      );
    }
     if (!tenant) {
      return NextResponse.json(
        { message: "No tenant assigned to your property" },
        { status: 404 }
      );
    }

   
 const newBill = await UtilityBill.create({
    propertyId: property?._id,
    landlordId: UserId,
    tenantId: tenant?._id, // TODO: check 
    utilityType,
    amount,
       billingPeriod: {
        start: new Date(billingPeriod.start),
        end: new Date(billingPeriod.end)
      },
    dueDate: new Date(dueDate),
    status: "pending",
    responsibleParty ,
    billDocument,
    notes
 })
  newBill.save()
   
   return NextResponse.json({
    message: "Bill Created Sucessfully",
    newBill
   } , {status: 200})

    } catch (error) {
        console.log("Error while Creating Bill" , error)
        return NextResponse.json({
            message: "Error while creating bill"
        } , {status: 500})
    }

}