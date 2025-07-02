import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import VerificationRequest from '@/app/models/VerificationRequest';
import User from '@/app/models/User';
import Builder from '@/app/models/Builder';
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
      if (verificationRequest.requestDetails) {
        const builderData = {
          title: verificationRequest.requestDetails.companyName || user.name,
          image: verificationRequest.requestDetails.image || user.image || 'https://via.placeholder.com/300x200',
          logo: verificationRequest.requestDetails.logo || user.image || 'https://via.placeholder.com/100x100',
          projects: 0,
          description: verificationRequest.requestDetails.additionalInfo || `${user.name} is a verified builder on 100Gaj.`,
          established: verificationRequest.requestDetails.established || 'N/A',
          headquarters: verificationRequest.requestDetails.headquarters || 'N/A',
          specialization: verificationRequest.requestDetails.specialization || 'General Construction',
          rating: 0,
          completed: 0,
          ongoing: 0,
          contact: {
            email: user.email,
            phone: user.phone,
          }
        };
        await Builder.findOneAndUpdate(
          { title: builderData.title },
          builderData,
          { upsert: true, new: true }
        );
      }
    }
    
    return NextResponse.json(
      { message: 'Verification request approved successfully', request: verificationRequest },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error accepting verification request:', error);
    return NextResponse.json(
      { error: 'Failed to accept verification request' },
      { status: 500 }
    );
  }
}
