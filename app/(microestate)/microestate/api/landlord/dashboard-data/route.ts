import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching landlord dashboard data...");
    
    await dbConnect();
    console.log("Database connected successfully");
    
    // Get user ID from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the landlord user
    const landlord = await User.findById(userId);
    
    if (!landlord) {
      return NextResponse.json(
        { error: "Landlord not found" },
        { status: 404 }
      );
    }

    if (landlord.role !== 'landlord') {
      return NextResponse.json(
        { error: "User is not a landlord" },
        { status: 403 }
      );
    }

    // TODO: In a real application, you would fetch actual data from Property, Tenant, etc. models
    // For now, returning mock data based on the landlord
    const dashboardData = {
      landlord: {
        id: landlord._id,
        name: landlord.name,
        email: landlord.email,
        phone: landlord.phone,
      },
      stats: {
        totalProperties: 0, // TODO: Count from Property model
        availableProperties: 0, // TODO: Count from Property model where status = 'available'
        activeTenants: 0, // TODO: Count from Tenant model
        monthlyIncome: 0, // TODO: Calculate from rent payments
        upcomingRentDue: 0, // TODO: Count from rent schedule
        totalInquiries: 0, // TODO: Count from Inquiry model
        pendingInquiries: 0, // TODO: Count from Inquiry model where status = 'pending'
      },
      properties: [], // TODO: Fetch from Property model
      tenants: [], // TODO: Fetch from Tenant model
      recentInquiries: [], // TODO: Fetch from Inquiry model
      recentPayments: [], // TODO: Fetch from Payment model
    };

    console.log("Dashboard data fetched successfully");
    return NextResponse.json(
      {
        success: true,
        data: dashboardData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Dashboard Data Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "An error occurred while fetching dashboard data" },
      { status: 500 }
    );
  }
} 