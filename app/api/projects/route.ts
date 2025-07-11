import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Project from '@/app/models/Project';
import { withAuth } from '@/app/lib/auth-middleware';

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const projectType = searchParams.get('projectType');
    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const query: any = { status: 'active' };
    
    if (projectType) query.projectType = projectType;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (locality) query.locality = { $regex: locality, $options: 'i' };
    
    const projects = await Project.find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('developer', 'name email')
      .select('-__v');
    
    return NextResponse.json({ 
      success: true, 
      count: projects.length,
      projects
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch projects' 
    }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    await connectDB();
    
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'projectName', 'projectType', 'propertyTypesOffered', 'projectStage', 
      'reraRegistrationNo', 'projectTagline', 'developerDescription',
      'city', 'locality', 'projectAddress', 'unitTypes', 'possessionDate',
      'constructionStatus', 'projectImages', 'developerContact'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create project with user as developer
    const projectData = {
      ...data,
      developer: userId,
      status: 'pending', // Projects need approval
      verified: false,
      views: 0,
      favorites: 0,
      inquiries: 0,
    };
    
    const project = new Project(projectData);
    await project.save();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully and is pending approval',
        project,
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred while creating the project' },
      { status: 500 }
    );
  }
});
