import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";
import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/models/User";
import Property from "@/app/models/Property";


// first find the user in database from userId
// find the property using property id from database
// check if the user own the property
// check if the user is Landlord
// use updatebyId 
// use the new edited property
// return respone 

export const POST = withAuth(async (request: NextRequest, userId: string) => {

    await dbConnect()

 try {
     const { propertyId , editedData } = await request.json();
   
      if (!propertyId || !editedData) {
       return NextResponse.json({
           error: "Property Id and Edited data are required!!"
       }, {status: 401})
      }
   
      const user = await User.findById({userId})
      if (!user) {
       return NextResponse.json({
           error: "User does not existed"
       }, {status: 401})
      }
      
      const property = await Property.findById({propertyId})
      if (!property) {
        return NextResponse.json({
           error: "Property Does not exists"
       }, {status: 401})
      }
   
      if (property.owner.toString() !== userId) {
        return NextResponse.json({
           error: "Only Owner can Update"
       }, {status: 401})
      }
   
    if (user.role !== "landlord") {
         return NextResponse.json(
           { error: "Only landlords can edit property" },
            { status: 403 });
       }
   
       const updatedProperty = await Property.findByIdAndUpdate(propertyId , editedData)
       await updatedProperty.save()
   
        return NextResponse.json({
            message: "Property updated", 
            property: updatedProperty },
        {status: 200});
   
   
 } catch (error) {
    console.log("Error while editing the post")
 return NextResponse.json({
            message: "Property updated", 
            } , {status: 400});
 }
});
