import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Builder from '@/app/models/Builder';
import mongoose from 'mongoose';

// GET a specific builder by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid builder ID' },
        { status: 400 }
      );
    }
    
    // Find the builder by ID
    const builder = await Builder.findById(id);
    
    if (!builder) {
      return NextResponse.json(
        { error: 'Builder not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ builder }, { status: 200 });
  } catch (error) {
    console.error('Error fetching builder:', error);
    return NextResponse.json(
      { error: 'Failed to fetch builder' },
      { status: 500 }
    );
  }
}

// PUT/PATCH to update a builder
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const updateData = await req.json();
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid builder ID' },
        { status: 400 }
      );
    }
    
    // Find and update the builder
    const updatedBuilder = await Builder.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBuilder) {
      return NextResponse.json(
        { error: 'Builder not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ builder: updatedBuilder }, { status: 200 });
  } catch (error) {
    console.error('Error updating builder:', error);
    return NextResponse.json(
      { error: 'Failed to update builder' },
      { status: 500 }
    );
  }
}

// Add a review to a builder
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const reviewData = await req.json();
    
    // Validate required fields
    if (!reviewData.user || !reviewData.text || !reviewData.rating) {
      return NextResponse.json(
        { error: 'Missing required review fields' },
        { status: 400 }
      );
    }
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid builder ID' },
        { status: 400 }
      );
    }
    
    // Create a review object with date
    const review = {
      ...reviewData,
      date: reviewData.date || new Date().toISOString().split('T')[0]
    };
    
    // Add the review to the builder
    const builder = await Builder.findByIdAndUpdate(
      id,
      { $push: { reviews: review } },
      { new: true }
    );
    
    if (!builder) {
      return NextResponse.json(
        { error: 'Builder not found' },
        { status: 404 }
      );
    }
    
    // Recalculate the average rating
    const totalRating = builder.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    const averageRating = totalRating / builder.reviews.length;
    
    // Update the builder with the new average rating
    const updatedBuilder = await Builder.findByIdAndUpdate(
      id,
      { rating: parseFloat(averageRating.toFixed(1)) },
      { new: true }
    );
    
    return NextResponse.json(
      { message: 'Review added successfully', builder: updatedBuilder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
} 