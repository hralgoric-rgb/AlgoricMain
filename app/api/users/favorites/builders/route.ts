import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
import '@/app/models/Builder'
// GET /api/users/favorites/builders - Get all favorite builders for current user
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    await connectDB();
    
    // Get user with populated builder favorites
    const user = await User.findById(userId)
      .populate({
        path: 'favorites.builders',
        select: 'name logo image description projects website established rating reviewCount'
      });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favorites: user.favorites?.builders || [],
      success: true
    });
  } catch (error) {
    console.error('Error fetching favorite builders:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching favorite builders' },
      { status: 500 }
    );
  }
});

// POST /api/users/favorites/builders - Add a builder to favorites
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const { builderId } = await request.json();
    
    if (!builderId) {
      return NextResponse.json(
        { error: 'Builder ID is required' },
        { status: 400 }
      );
    }
    
    if (!mongoose.Types.ObjectId.isValid(builderId)) {
      return NextResponse.json(
        { error: 'Invalid builder ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if builder exists - we assume the Builder model exists
    const Builder = mongoose.model('Builder');
    const builder = await Builder.findById(builderId);
    if (!builder) {
      return NextResponse.json(
        { error: 'Builder not found' },
        { status: 404 }
      );
    }
    
    // Add to user's favorite builders
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { 'favorites.builders': builderId } },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Builder added to favorites'
    });
  } catch (error) {
    console.error('Error adding builder to favorites:', error);
    return NextResponse.json(
      { error: 'An error occurred while adding builder to favorites' },
      { status: 500 }
    );
  }
}); 