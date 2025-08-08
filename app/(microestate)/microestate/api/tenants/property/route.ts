// properties id 
import { NextRequest , NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import { requireTenant } from "@/app/(microestate)/middleware/auth";
import Lease from "@/app/(microestate)/models/Lease";
import Property from "@/app/(microestate)/models/Property";
import MicroestateUser from "@/app/(microestate)/models/user";

export const GET = requireTenant( async (request: NextRequest, user: { userId: string; userEmail: string; userRole: string }) => {

    const { userId } = user;
    await dbConnect()

    try {
        console.log("🔍 Fetching leases for tenant:", userId);
        
        // Ensure all models are registered before the populate operation
        // This prevents MissingSchemaError during population
        Property; // Registers MicroProperty model
        MicroestateUser; // Registers MicroestateUser model
        
        const response =  await Lease.findByTenant(userId);
        console.log("📋 Leases found:", response?.length || 0);

        if (!response || response.length === 0) {
            console.log("❌ No leases found for tenant:", userId);
            return NextResponse.json({ message: "No leases found for this tenant" }, { status: 404 });
        }

        console.log("✅ Returning leases for tenant:", userId);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.log("Error while fetching leases:", error);
        return NextResponse.json({ message: "Error while fetching leases" }, { status: 500 });
    }
});

