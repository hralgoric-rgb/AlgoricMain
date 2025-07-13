import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import '@/app/models/Property';
import { withAuth } from '@/app/lib/auth-middleware';

// GET /api/users/favorites/properties - Get all favorite properties for current user
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    await connectDB();
    
    // Get user with populated property favorites
    const user = await User.findById(userId)
      .populate({
        path: 'favorites.properties',
        select: 'title price propertyType listingType bedrooms bathrooms area images address status'
      });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favorites: user.favorites?.properties || [],
      success: true
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching favorite properties' },
      { status: 500 }
    );
  }
}); 