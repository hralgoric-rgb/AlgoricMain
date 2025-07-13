import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import CommercialProperty from '@/app/models/CommercialProperty';

// GET /api/commercial - Get all commercial properties (with filtering and sorting)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const propertyType = searchParams.get('propertyType');
    const city = searchParams.get('city');
    const minROI = searchParams.get('minROI');
    const maxROI = searchParams.get('maxROI');
    const minYield = searchParams.get('minYield');
    const maxYield = searchParams.get('maxYield');
    const minInvestment = searchParams.get('minInvestment');
    const maxInvestment = searchParams.get('maxInvestment');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy') || 'currentROI';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build query based on filters
    const query: any = {};
    
    // Filter by property type
    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }
    
    // Filter by city
    if (city && city !== 'all') {
      query['address.city'] = { $regex: city, $options: 'i' };
    }
    
    // Filter by ROI range
    if (minROI || maxROI) {
      query.currentROI = {};
      if (minROI) query.currentROI.$gte = parseFloat(minROI);
      if (maxROI) query.currentROI.$lte = parseFloat(maxROI);
    }
    
    // Filter by rental yield range
    if (minYield || maxYield) {
      query.rentalYield = {};
      if (minYield) query.rentalYield.$gte = parseFloat(minYield);
      if (maxYield) query.rentalYield.$lte = parseFloat(maxYield);
    }
    
    // Filter by investment amount
    if (minInvestment || maxInvestment) {
      query.minInvestment = {};
      if (minInvestment) query.minInvestment.$gte = parseInt(minInvestment);
      if (maxInvestment) query.minInvestment.$lte = parseInt(maxInvestment);
    }
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    } else {
      // By default, only show active properties unless specifically requested
      query.status = 'active';
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Build sort object
    const sortObj: any = {};
    switch (sortBy) {
      case 'roi_desc':
        sortObj.currentROI = -1;
        break;
      case 'roi_asc':
        sortObj.currentROI = 1;
        break;
      case 'yield_desc':
        sortObj.rentalYield = -1;
        break;
      case 'yield_asc':
        sortObj.rentalYield = 1;
        break;
      case 'min_investment':
        sortObj.minInvestment = 1;
        break;
      case 'price_asc':
        sortObj.pricePerShare = 1;
        break;
      case 'price_desc':
        sortObj.pricePerShare = -1;
        break;
      case 'newest':
        sortObj.createdAt = -1;
        break;
      case 'oldest':
        sortObj.createdAt = 1;
        break;
      default:
        sortObj.currentROI = -1; // Default to highest ROI first
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute the query
    const [properties, totalCount] = await Promise.all([
      CommercialProperty.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(), // Use lean() for better performance
      CommercialProperty.countDocuments(query)
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return NextResponse.json({
      success: true,
      data: {
        properties,
        pagination: {
          current: page,
          total: totalPages,
          count: properties.length,
          totalCount,
          hasNext,
          hasPrev,
          limit
        },
        filters: {
          propertyType,
          city,
          minROI,
          maxROI,
          minYield,
          maxYield,
          minInvestment,
          maxInvestment,
          status,
          featured,
          sortBy,
          sortOrder
        }
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching commercial properties:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch commercial properties',
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}

// POST /api/commercial - Create a new commercial property (for admin use)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'location', 'address', 'images', 
      'propertyType', 'totalArea', 'builtYear', 'developer',
      'totalPropertyValue', 'totalShares', 'availableShares', 
      'pricePerShare', 'minInvestment', 'currentROI', 'rentalYield',
      'appreciationRate', 'currentOccupancy', 'monthlyRental',
      'spvId', 'spvName'
    ];
    
    const missingFields = requiredFields.filter(field => {
      if (field === 'address') {
        return !data[field] || !data[field].street || !data[field].city || 
               !data[field].state || !data[field].zipCode || !data[field].coordinates;
      }
      if (field === 'developer') {
        return !data[field] || !data[field].name || !data[field].rating || 
               data[field].projectsCompleted === undefined;
      }
      return !data[field] && data[field] !== 0;
    });
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      }, { status: 400 });
    }
    
    // Validate that availableShares doesn't exceed totalShares
    if (data.availableShares > data.totalShares) {
      return NextResponse.json({
        success: false,
        error: 'Available shares cannot exceed total shares'
      }, { status: 400 });
    }
    
    // Check if SPV ID is unique
    const existingProperty = await CommercialProperty.findOne({ spvId: data.spvId });
    if (existingProperty) {
      return NextResponse.json({
        success: false,
        error: 'SPV ID already exists. Please use a unique SPV ID.'
      }, { status: 400 });
    }
    
    // Create the property with defaults for optional fields
    const propertyData = {
      ...data,
      status: data.status || 'active',
      featured: data.featured || false,
      amenities: data.amenities || [],
      nearbyLandmarks: data.nearbyLandmarks || [],
      documents: data.documents || []
    };
    
    // Create and save the new property
    const property = new CommercialProperty(propertyData);
    await property.save();
    
    return NextResponse.json({
      success: true,
      message: 'Commercial property created successfully',
      data: {
        property: property.toObject()
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating commercial property:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        success: false,
        error: `${field} already exists. Please use a unique value.`
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create commercial property',
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
