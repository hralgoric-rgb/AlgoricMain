import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';

// DELETE /api/users/favorites/agents/:agentId - Remove an agent from favorites
export const DELETE = withAuth(async (request: NextRequest, userId: string, { params }: { params: { agentId: string } }) => {
  const { agentId } = params;
  
  try {
    await connectDB();
    
    // Remove agent from user's favorites
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { 'favorites.agents': agentId } },
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
      message: 'Agent removed from favorites'
    });
  } catch (error) {
    console.error('Error removing agent from favorites:', error);
    return NextResponse.json(
      { error: 'An error occurred while removing agent from favorites' },
      { status: 500 }
    );
  }
}); 