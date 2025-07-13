import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import VerificationRequest from '@/app/models/VerificationRequest';
import User from '@/app/models/User';
import mongoose from 'mongoose';
import { verifyToken } from '@/app/lib/utils';

// POST /api/requests/:id/accept - Accept a verification request
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decodedUser = verifyToken(token);
    
    const { id: requestId } = await context.params;
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 });
    }
    
    const verificationRequest = await VerificationRequest.findById(requestId);
    if (!verificationRequest) {
      return NextResponse.json({ error: 'Verification request not found' }, { status: 404 });
    }
    if (verificationRequest.status !== 'pending') {
      return NextResponse.json({ error: 'This request has already been processed' }, { status: 409 });
    }
    
    const user = await User.findById(verificationRequest.userId);
    if (!user) {
      return NextResponse.json({ error: 'User associated with this request not found' }, { status: 404 });
    }
    
    verificationRequest.status = 'approved';
    verificationRequest.reviewedBy = decodedUser.userId;
    await verificationRequest.save();
    
    if (verificationRequest.type === 'agent') {
      user.isAgent = true;
      user.role = 'agent';
      if (verificationRequest.requestDetails) {
        user.agentInfo = {
          ...user.agentInfo,
          verified: true,
          licenseNumber: verificationRequest.requestDetails.licenseNumber,
          agency: verificationRequest.requestDetails.agency,
          experience: verificationRequest.requestDetails.experience,
          specializations: verificationRequest.requestDetails.specializations,
          languages: verificationRequest.requestDetails.languages,
        };
        // Add image to user profile if provided in verification request
        if (verificationRequest.requestDetails.image) {
          user.image = verificationRequest.requestDetails.image;
        }
      } else {
        if (!user.agentInfo) {
          user.agentInfo = { verified: true };
        } else {
          user.agentInfo.verified = true;
        }
      }
      await user.save();
    } else if (verificationRequest.type === 'builder') {
      // Update user profile to mark as builder
      user.isBuilder = true;
      user.role = 'builder';
      
      if (verificationRequest.requestDetails) {
        // Update user's builderInfo with all the details
        user.builderInfo = {
          ...user.builderInfo,
          verified: true,
          companyName: verificationRequest.requestDetails.companyName,
          licenseNumber: verificationRequest.requestDetails.licenseNumber,
          established: verificationRequest.requestDetails.established ? new Date(verificationRequest.requestDetails.established) : undefined,
          experience: verificationRequest.requestDetails.experience,
          specializations: verificationRequest.requestDetails.specialization ? [verificationRequest.requestDetails.specialization] : [],
          completedProjects: 0,
          ongoingProjects: 0,
          rating: 4.0,
          reviewCount: 0
        };
        
        // Add image and bio to user profile if provided in verification request
        if (verificationRequest.requestDetails.image) {
          user.image = verificationRequest.requestDetails.image;
        }
        
        if (verificationRequest.requestDetails.additionalInfo) {
          user.bio = verificationRequest.requestDetails.additionalInfo;
        }
      } else {
        // Minimal builderInfo if no details provided
        if (!user.builderInfo) {
          user.builderInfo = { 
            verified: true,
            completedProjects: 0,
            ongoingProjects: 0,
            rating: 4.0,
            reviewCount: 0
          };
        } else {
          user.builderInfo.verified = true;
        }
      }
      
      await user.save();
    }
    
    return NextResponse.json(
      { message: 'Verification request approved successfully', request: verificationRequest },
      { status: 200 }
    );
    
  } catch (_error) {

    return NextResponse.json(
      { error: 'Failed to accept verification request' },
      { status: 500 }
    );
  }
}
