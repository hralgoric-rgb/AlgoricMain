import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Project from '@/app/models/Project';
import mongoose from 'mongoose';

// GET a specific builder by ID (from User collection)
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
    
    // Find the builder by ID in User collection
    const builder = await User.findOne({
      _id: id,
      isBuilder: true,
      'builderInfo.verified': true
    }).select('name email image phone bio builderInfo createdAt');
    
    if (!builder) {
      return NextResponse.json(
        { error: 'Builder not found' },
        { status: 404 }
      );
    }
    
    // Fetch builder's projects
    const projects = await Project.find({ 
      developer: builder._id,
      status: { $in: ['active', 'approved'] }
    }).select('projectName projectType locality city projectImages projectTagline projectAmenities unitTypes createdAt status possessionDate');
    
    // Format the builder data
    const formattedBuilder = {
      _id: builder._id,
      title: builder.builderInfo?.companyName || builder.name,
      name: builder.name,
      image: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      logo: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      projects: projects.length,
      description: `Verified builder with ${builder.builderInfo?.experience || 0} years of experience in real estate development`,
      established: builder.builderInfo?.established ? 
        new Date(builder.builderInfo.established).getFullYear().toString() : 
        new Date(builder.createdAt).getFullYear().toString(),
      headquarters: 'Delhi, India',
      specialization: builder.builderInfo?.specializations?.join(', ') || 'Residential, Commercial',
      rating: builder.builderInfo?.rating || 4.0,
      completed: builder.builderInfo?.completedProjects || 0,
      ongoing: builder.builderInfo?.ongoingProjects || 0,
      about: builder.bio || `${builder.builderInfo?.companyName || builder.name} is a verified builder committed to delivering quality real estate projects.`,
      projects_list: projects.map(project => ({
        _id: project._id,
        name: project.projectName,
        location: `${project.locality}, ${project.city}`,
        status: project.status === 'active' || project.status === 'approved' ? 'Ongoing' : 'Completed',
        type: project.projectType,
        images: project.projectImages || [],
        tagline: project.projectTagline,
        amenities: project.projectAmenities || [],
        unitTypes: project.unitTypes || [],
        possessionDate: project.possessionDate
      })),
      contact: {
        email: builder.email,
        phone: builder.phone || '',
        website: '',
        address: 'Delhi, India'
      },
      experience: builder.builderInfo?.experience || 0,
      verified: builder.builderInfo?.verified || false,
      reviews: [] // You can add reviews functionality later
    };
    
    return NextResponse.json({ builder: formattedBuilder }, { status: 200 });
  } catch (error) {
    console.error('Error fetching builder:', error);
    return NextResponse.json(
      { error: 'Failed to fetch builder' },
      { status: 500 }
    );
  }
} 