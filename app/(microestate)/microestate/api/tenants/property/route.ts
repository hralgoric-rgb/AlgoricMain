// properties id 
import { NextRequest , NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import { requireTenant } from "@/app/(microestate)/middleware/auth";
import Lease from "@/app/(microestate)/models/Lease";

export const GET = requireTenant( async (request: NextRequest, context: { userId: string; userEmail: string }) => {

    const { userId } = context;
    await dbConnect()

    try {
        const response =  await Lease.findByTenant(userId);

        if (!response || response.length === 0) {
            return NextResponse.json({ message: "No leases found for this tenant" }, { status: 404 });
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.log("Error while fetching leases:", error);
        return NextResponse.json({ message: "Error while fetching leases" }, { status: 500 });
    }
});

