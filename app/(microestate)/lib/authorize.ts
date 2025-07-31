import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

interface User {
  _id: string;
  email: string;
  role: "landlord" | "tenant";
  name?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Extract and verify user authentication from request using NextAuth
 */
export async function getUserFromRequest(request: NextRequest): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  try {
    // // First check for headers set by middleware
    // const userIdHeader = request.headers.get("x-user-id");
    // const userRoleHeader = request.headers.get("x-user-role");
    // const userEmailHeader = request.headers.get("x-user-email");

    // console.log("🔍 Headers from middleware:", {
    //   userId: userIdHeader,
    //   userRole: userRoleHeader,
    //   userEmail: userEmailHeader,
    // });

    // if (userIdHeader && userRoleHeader && userEmailHeader) {
    //   return {
    //     success: true,
    //     user: {
    //       _id: userIdHeader,
    //       email: userEmailHeader,
    //       role: userRoleHeader as "landlord" | "tenant",
    //     },
    //   };
    // }

    // // Try to get the microauth cookie directly first
    // const microauthCookie = request.cookies.get("microauth");

    // if (microauthCookie) {
    //   // console.log("🔄 Found microauth cookie, verifying...");

    //   try {
    //     const jwtSecret = process.env.NEXTAUTH_SECRET;
    //     if (!jwtSecret) {
    //       throw new Error("NEXTAUTH_SECRET is not configured");
    //     }

    //     const decoded = jwt.verify(microauthCookie.value, jwtSecret) as any;

    //     console.log("✅ Microauth token verified:", {
    //       id: decoded._id,
    //       role: decoded.role,
    //       email: decoded.email,
    //       name: decoded.name,
    //       firstName: decoded.firstName,
    //       lastName: decoded.lastName,
    //     });

    //     return {
    //       success: true,
    //       user: {
    //         _id: decoded._id,
    //         email: decoded.email,
    //         role: decoded.role,
    //         name: decoded.name,
    //         // firstName: decoded.firstName,
    //         // lastName: decoded.lastName,
    //       },
    //     };
    //   } catch (jwtError) {
    //     console.error("❌ JWT verification failed:", jwtError);
    //     // Continue to NextAuth fallback
    //   }
    // }

    // // Fallback: Use NextAuth to get token
    // console.log("🔄 Falling back to NextAuth token verification...");

    // Use NextAuth's built-in token handling
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "microauth",
    });

    console.log("Token payload:", token);

    if (!token) {
      console.log("❌ No valid token found");
      return { success: false, error: "No valid authentication token found" };
    }

    console.log("✅ NextAuth token verified:", {
      id: token._id || token.sub,
      role: token.role,
      email: token.email,
      name: token.name,
    });

    return {
      success: true,
      user: {
        _id: (token.sub as string) || (token._id as string), // Use standard sub claim
        email: token.email as string,
        role: token.role as "landlord" | "tenant",
        name: token.name as string,
      },
    };
  } catch (error) {
    console.error("❌ Auth error:", error);
    return { success: false, error: "Invalid authentication token" };
  }
}

/**
 * Landlord authorization middleware for API routes
 */
export function requireLandlord(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    console.log("🏠 RequireLandlord called for:", request.url);

    const authResult = await getUserFromRequest(request);

    if (!authResult.success || !authResult.user) {
      console.log("❌ Authentication failed:", authResult.error);
      return NextResponse.json(
        {
          success: false,
          message: authResult.error || "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    if (authResult.user.role !== "landlord") {
      // console.log("❌ User is not a landlord:", authResult.user.role);
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Landlord role required.",
        },
        {
          status: 403,
        }
      );
    }


    // Pass user data to the handler
    const contextWithUser = {
      userId: authResult.user._id,
      userRole: authResult.user.role,
      userEmail: authResult.user.email,
      ...context,
    };

    return handler(request, contextWithUser);
  };
}

/**
 * Tenant authorization middleware for API routes
 */
export function requireTenant(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    console.log("🏠 RequireTenant called for:", request.url);

    const authResult = await getUserFromRequest(request);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.error || "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    if (authResult.user.role !== "tenant") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Tenant role required.",
        },
        {
          status: 403,
        }
      );
    }

    const contextWithUser = {
      userId: authResult.user._id,
      userRole: authResult.user.role,
      userEmail: authResult.user.email,
      ...context,
    };

    return handler(request, contextWithUser);
  };
}

/**
 * General authentication middleware (for routes that need any authenticated user)
 */
export function requireAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const authResult = await getUserFromRequest(request);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.error || "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const contextWithUser = {
      userId: authResult.user._id,
      userRole: authResult.user.role,
      userEmail: authResult.user.email,
      ...context,
    };

    return handler(request, contextWithUser);
  };
}
