import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '../lib/db';
import MicroestateUser from "@/app/(microestate)/models/user";

interface AuthUser {
  userId: string;
  userEmail: string;
  userRole: string;
}

// Generic auth function that works for any authenticated user
export function requireAuth(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      console.log('🔐 RequireAuth called for:', request.url);
      
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });

      console.log('Token found:', !!token, token?.id);

      if (!token || !token.id) {
        console.log('❌ No valid token found');
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }

      // Verify user exists in database
      await dbConnect();
      const user = await MicroestateUser.findById(token.id);

      if (!user) {
        console.log('❌ User not found in database:', token.id);
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 401 }
        );
      }

      console.log('✅ User authenticated:', {
        id: user._id.toString(),
        role: user.role,
        email: user.email
      });

      const authUser: AuthUser = {
        userId: user._id.toString(),
        userEmail: user.email,
        userRole: user.role
      };

      return await handler(request, authUser);
    } catch (error) {
      console.error('❌ Auth middleware error:', error);
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

// For regular routes
export function requireLandlord(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      console.log('🏠 RequireLandlord called for:', request.url);
      
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });

      console.log('Token found:', !!token, token?.id);

      if (!token || !token.id) {
        console.log('❌ No valid token found');
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }

      // Verify user exists in database
      await dbConnect();
      const user = await MicroestateUser.findById(token.id);

      if (!user) {
        console.log('❌ User not found in database:', token.id);
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 401 }
        );
      }

      if (user.role !== 'landlord') {
        console.log('❌ User is not a landlord:', user.role);
        return NextResponse.json(
          { success: false, message: 'Landlord access required' },
          { status: 403 }
        );
      }

      console.log('✅ User authenticated:', {
        id: user._id.toString(),
        role: user.role,
        email: user.email
      });

      const authUser: AuthUser = {
        userId: user._id.toString(),
        userEmail: user.email,
        userRole: user.role
      };

      return await handler(request, authUser);
    } catch (error) {
      console.error('❌ Auth middleware error:', error);
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}


export function requireTenant(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }

      await dbConnect();
      const user = await MicroestateUser.findById(token.id); // Fixed: use token.id instead of token._id

      if (!user || user.role !== 'tenant') {
        return NextResponse.json(
          { success: false, message: 'Tenant access required' },
          { status: 403 }
        );
      }

      const authUser: AuthUser = {
        userId: user._id.toString(),
        userEmail: user.email,
        userRole: user.role
      };

      return await handler(request, authUser);
    } catch (error) {
      console.error('Tenant auth error:', error);
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}