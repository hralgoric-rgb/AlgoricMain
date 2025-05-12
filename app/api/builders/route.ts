import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Builder from '@/app/models/Builder';

// GET all builders
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Get search query from URL if it exists
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('search') || '';
    
    let query = {};
    
    // If search term exists, build a search query
    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { specialization: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }
    
    // Get all builders, or filtered by search
    const builders = await Builder.find(query)
      .select('title image logo projects description established headquarters specialization rating completed ongoing')
      .sort({ rating: -1 });
      
    return NextResponse.json({ builders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching builders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch builders' },
      { status: 500 }
    );
  }
}

// POST create a new builder (optional, for admin purposes)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const builderData = await req.json();
    
    const newBuilder = await Builder.create(builderData);
    
    return NextResponse.json(
      { message: 'Builder created successfully', builder: newBuilder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating builder:', error);
    return NextResponse.json(
      { error: 'Failed to create builder' },
      { status: 500 }
    );
  }
} 