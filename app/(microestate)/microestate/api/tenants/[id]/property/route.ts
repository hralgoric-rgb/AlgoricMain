// properties id 
import { NextRequest , NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import Property from "@/app/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";

export async function GET(request:NextRequest , {params}: {params: {id: string}}) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if(!session) {
        return NextResponse.json({
            message: "UnAuthorized"
        } , {status: 401})
    }

    
  const tenantIdFromParam = params.id;
  const userIdFromSession = session.user.id;


  if (tenantIdFromParam !== userIdFromSession) {
    return NextResponse.json({ message: "forbidden" }, { status: 403 });
  }

    try {
        if(!tenantIdFromParam) {
            return NextResponse.json({
                message: "Property Id is required!"
            })
        }

        const property = await Property.findOne({tenant: tenantIdFromParam})
        if(!property) {
            return NextResponse.json({
                message: "No property assigned "
            } , {status: 400})
        }
    
    return NextResponse.json({
        messaage: "Sucessfully fetched sucessffully",
        property,
    } , {status: 201})

    } catch (error) {
        console.log("Error while  fetching the property")
        return NextResponse.json({
            message: "Error while fetching the property"
        } , {status: 400})
    }

}