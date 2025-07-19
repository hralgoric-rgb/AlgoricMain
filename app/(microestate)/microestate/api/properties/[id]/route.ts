import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/(microestate)/lib/db';
import Property from '@/app/(microestate)/models/Property';
import mongoose from 'mongoose';
import { requireLandlord } from '@/app/(microestate)/middleware';

// Helper function to validate ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);


// GET microestate/api/properties/[id] - get  property detail of a landlord
export const GET = requireLandlord(async (
  params: { id: string },
  context: { userId: string; userRole: string; userEmail: string }
) => {
  const { userId } = context;
  try {
    const { id } = await params;

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: 'Invalid property ID format' },
        { status: 400 }
      );
    }

    await dbConnect();

    const property = await Property.findOne({_id: id, landlordId: userId}).select("-landlordId").lean();

    if (!property) {
      return NextResponse.json(
        { error: 'Properties not Found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property, { status: 200 });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching the property' },
      { status: 500 }
    );
  }
}
);

// // PUT /api/properties/[id] - Update a property
// export const PUT = requireLandlord(async (
//   request: NextRequest,
//   userId: string
// ) => {
//   try {
//     const id = request.url.split('/').pop();

//     if (!id || !isValidObjectId(id)) {
//       return NextResponse.json(
//         { error: 'Invalid property ID format' },
//         { status: 400 }
//       );
//     }

//     const data = await request.json();
//     await DBconnect();

//     // Find property and check ownership
//     const property = await Property.findById(id);

//     if (!property) {
//       return NextResponse.json(
//         { error: 'Property not found' },
//         { status: 404 }
//       );
//     }

//     // Check if user is the owner or agent
//     if (property.owner.toString() !== userId && (!property.agent || property.agent.toString() !== userId)) {
//       return NextResponse.json(
//         { error: 'You do not have permission to update this property' },
//         { status: 403 }
//       );
//     }

//     // Remove fields that shouldn't be updated
//     const {...updateData } = data;
    
//     // Update the property
//     const updatedProperty = await Property.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Property updated successfully',
//         property: updatedProperty,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {

//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.keys(error.errors).map(key => ({
//         field: key,
//         message: error.errors[key].message,
//       }));

//       return NextResponse.json(
//         { error: 'Validation failed', details: validationErrors },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'An error occurred while updating the property' },
//       { status: 500 }
//     );
//   }
// });

// // DELETE /api/properties/[id] - Delete a property
// export const DELETE = withAuth(async (
//   request: NextRequest,
//   userId: string
// ) => {
//   try {
//     const id = request.url.split('/').pop();

//     if (!id || !isValidObjectId(id)) {
//       return NextResponse.json(
//         { error: 'Invalid property ID format' },
//         { status: 400 }
//       );
//     }

//     await DBconnect();

//     // Find property and check ownership
//     const property = await Property.findById(id);

//     if (!property) {
//       return NextResponse.json(
//         { error: 'Property not found' },
//         { status: 404 }
//       );
//     }

//     // Check if user is the owner
//     if (property.owner.toString() !== userId) {
//       return NextResponse.json(
//         { error: 'You do not have permission to delete this property' },
//         { status: 403 }
//       );
//     }

//     // Delete the property
//     await Property.findByIdAndDelete(id);

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Property deleted successfully',
//       },
//       { status: 200 }
//     );
//   } catch (_error) {

//     return NextResponse.json(
//       { error: 'An error occurred while deleting the property' },
//       { status: 500 }
//     );
//   }
// });
