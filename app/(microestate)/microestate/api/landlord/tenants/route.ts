import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";
import Lease from "@/app/(microestate)/models/Lease";

export const GET = requireLandlord(async (request: NextRequest, context: { userId: string; userEmail: string }) => {
    const { userId } = context;
    await dbConnect();

    try {
        // Find all leases for this landlord and populate tenant and property details
        const allLeases = await Lease.findByLandlord(userId);

        if (!allLeases || allLeases.length === 0) {
            return NextResponse.json({ 
                message: "No tenants found for this landlord",
                tenants: []
            }, { status: 200 });
        }

        // Filter out terminated leases (removed tenants)
        const activeLeases = allLeases.filter((lease: any) => lease.status !== 'terminated');

        if (activeLeases.length === 0) {
            return NextResponse.json({ 
                message: "No active tenants found for this landlord",
                tenants: []
            }, { status: 200 });
        }

        // Transform lease data into tenant format for the frontend
        const tenants = activeLeases.map((lease: any) => ({
            _id: lease.tenantId._id || lease.tenantId,
            name: lease.tenantId.name || `${lease.tenantId.firstName || ''} ${lease.tenantId.lastName || ''}`.trim() || 'Unknown',
            email: lease.tenantId.email || 'N/A',
            phone: lease.tenantId.phone || 'N/A',
            property: {
                _id: lease.propertyId._id || lease.propertyId,
                title: lease.propertyId.title || 'Unknown Property',
                address: lease.propertyId.address || 'N/A',
                rent: lease.propertyId.rent || lease.monthlyRent
            },
            rentAmount: lease.monthlyRent,
            status: lease.status === 'active' ? 'active' : 
                   lease.isExpired() ? 'overdue' : 'inactive',
            leaseStart: lease.startDate,
            leaseEnd: lease.endDate,
            leaseId: lease._id
        }));

        return NextResponse.json({
            message: "Tenants fetched successfully",
            tenants
        }, { status: 200 });

    } catch (error) {
        console.error("Error while fetching landlord tenants:", error);
        return NextResponse.json({ 
            message: "Error while fetching tenants" 
        }, { status: 500 });
    }
});
