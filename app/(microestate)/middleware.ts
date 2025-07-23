import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User, { IUser, IUserModel } from "./models/user";
import { error } from "console";
import { use } from "react";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Types for middleware functions
interface AuthenticatedRequest extends Request {
  user: IUser;
}

interface AuthMiddlewareResponse {
  status(code: number): AuthMiddlewareResponse;
  json(data: any): AuthMiddlewareResponse;
}

type NextFunction = () => void;

// JWT payload interface
interface JWTPayload {
  _id: string;
  email: string;
  role: "landlord" | "tenant";
  image?: string;
  name?: string;
}

// API Response types
interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// Next.js 13 App Router Middleware
export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    const authToken = request.cookies.get("microauth")?.value;
    console.log("Auth Token:", authToken);
    const url = new URL(request.url);

    if (url.pathname.startsWith("/microestate/api/auth")) {
      return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages
    if (authToken && url.pathname.startsWith("/microestate/auth")) {
      return NextResponse.redirect(new URL("/microestate", request.url));
    }

    // Check if user is authenticated for protected routes
    if (
      url.pathname.startsWith("/microestate/profile") ||
      url.pathname.startsWith("/microestate/dashboard")
    ) {
      if (!authToken) {
        return NextResponse.redirect(new URL("/microestate/auth", request.url));
      }

      // Verify token
      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          console.error("JWT_SECRET is not defined in environment variables");
          throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(
          authToken,
          process.env.JWT_SECRET || ""
        ) as JWTPayload;

        // Add user info to headers for API routes
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", decoded._id);
        requestHeaders.set("x-user-role", decoded.role);

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch (error) {
        // Invalid token - redirect to auth
        const response = NextResponse.redirect(
          new URL("/microestate/auth", request.url)
        );
        response.cookies.delete("microauthToken");
        return response;
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/microestate/profile/:path*",
    "/microestate/dashboard/:path*",
    "/microestate/auth/:path*",
    "/microestate/api/:path*",
  ],
};

/**
 * Landlord authorization middleware
 * Ensures user has landlord role
 */
export const requireLandlord = (handler: Function) => {
  return async (request: Request) => {
    const headers = new Headers(request.headers);
    const userId = headers.get("x-user-id") || undefined;
    const userRole =
      (headers.get("x-user-role") as "landlord" | "tenant") || undefined;
    const userEmail = headers.get("x-user-email") || undefined;

    if (!userId) {
      return Response.json({
          success: false,
          message: "Authentication Resquired.",
          error,
        }, {
        status: 401,
      });
    }

    if (userRole !== "landlord") {
      return Response.json(
        {
          success: false,
          message: "Access denied. Landlord role required.",
          error,
        },
        { status: 403 }
      );
    }

    return handler(request, { userId, userRole, userEmail });
  };
};

/**
 * Tenant authorization middleware
 */
export const requireTenant = (handler: Function) => {
  return async (request: Request) => {
    const headers = new Headers(request.headers);
    const userId = headers.get("x-user-id") || undefined;
    const userRole =
      (headers.get("x-user-role") as "landlord" | "tenant") || undefined;
    const userEmail = headers.get("x-user-email") || undefined;
    
    if (!userId) {
      return Response.json({
          success: false,
          message: "Authentication Resquired.",
          error,
        }, {
        status: 401,
      });
    }
    
    if (userRole !== 'tenant') {
      return Response.json(
        {
          success: false,
          message: "Access denied. Tenant role required.",
          error,
        },
        { status: 403 }
      );
    }
    
    return handler(request, { userId, userRole, userEmail });
  };
};
