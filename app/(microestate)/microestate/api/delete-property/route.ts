import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/(microestate)/lib/db';
import Property from '@/app/(microestate)/models/Property'
import { withAuth } from '@/app/lib/auth-middleware';
import User from '@/app/models/User';


export const DELETE = withAuth(async (request: NextRequest, userId: string) => {
 await dbConnect()

    try {
       const propertyId = request.nextUrl.pathname.split('/').pop() // extractting the property id from URL

       if (!propertyId) {
        return NextResponse.json({
            sucess: false,
            message: "Property Id is needed!!"
        } , {status: 400})
       }

       const user =  await User.findById(userId) 
      
    if (!user || user.role !== 'landlord') {
      return NextResponse.json(
        { error: 'Only landlords can delete properties' }, 
        { status: 403 });
    }
  
    const FoundProperty = await Property.findById(propertyId)

       if (!FoundProperty) {
         return NextResponse.json({
            sucess: true,
            message: "Property does not Exist in our database"
         })
       }
     
    
     if (FoundProperty.owner.toString() !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not own this property' },
        { status: 403 }
      );
    }

         await Property.findByIdAndDelete(propertyId)

    return NextResponse.json({
        success: true,
        message: "Property Deleted Sucessfully"
    } , {status: 200})

    
    } catch (error) {
        console.error("Error while deleting the property")
        return NextResponse.json({
            success: false,
            message: "Error while occur while deleting the property",
        }, {status: 401})
    }
}
);

   