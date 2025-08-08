import { NextRequest , NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import MicroestateUser from "@/app/(microestate)/models/user";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";


export async function GET(request: NextRequest , {params} : {params: {id: string}}) {
    await dbConnect()

   try {
    const user = await MicroestateUser.findById(params.id).select('-password')
    if (!user) {
           return NextResponse.json({error: "User not found in database"} , {status: 404})
    }

    return NextResponse.json({message: "User found Sucessfully", user} , {status: 201}  )

   } catch (error) {
    console.log("Error while finding user in database" ,  error)
    return NextResponse.json({
        message: "Error in database",
    } , {status: 500})
   }
  }