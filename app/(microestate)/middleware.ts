// import { NextRequest, NextResponse } from "next/server";
// export { default } from "next-auth/middleware";
// import jwt from "jsonwebtoken";

// // JWT payload interface
// interface JWTPayload {
//   _id: string;
//   email: string;
//   role: "landlord" | "tenant";
//   image?: string;
//   name?: string;
//   firstName?: string;
//   lastName?: string;
// }

// // Next.js 13 App Router Middleware
// export async function middleware(request: NextRequest): Promise<NextResponse> {
//   try {
//     const authToken = request.cookies.get("microauth")?.value;
//     console.log("🔍 Middleware running for:", request.nextUrl.pathname);
//     console.log("🔑 Auth Token found:", !!authToken);

//     const url = new URL(request.url);

//     // Skip auth routes
//     if (url.pathname.startsWith("/microestate/api/auth")) {
//       console.log("✅ Skipping auth route");
//       return NextResponse.next();
//     }

//     // Handle API routes that need authentication
//     if (url.pathname.startsWith("/microestate/api/")) {
//       console.log("🛡️ Processing API route for authentication");

//       if (!authToken) {
//         console.log("❌ No auth token for API route");
//         return NextResponse.json(
//           {
//             success: false,
//             message: "Authentication required",
//           },
//           { status: 401 }
//         );
//       }

//       // Verify token for API routes
//       try {
//         console.log("🔐 Verifying JWT token for API route...");
//         const jwtSecret = process.env.NEXTAUTH_SECRET; // Use NEXTAUTH_SECRET instead of JWT_SECRET
//         if (!jwtSecret) {
//           console.error(
//             "❌ NEXTAUTH_SECRET is not defined in environment variables"
//           );
//           throw new Error("NEXTAUTH_SECRET is not defined");
//         }

//         const decoded = jwt.verify(authToken, jwtSecret) as JWTPayload;
//         console.log("✅ Token verified successfully:", {
//           id: decoded._id,
//           role: decoded.role,
//         });

//         // Add user info to headers for API routes
//         const requestHeaders = new Headers(request.headers);
//         requestHeaders.set("x-user-id", decoded._id);
//         requestHeaders.set("x-user-role", decoded.role);
//         requestHeaders.set("x-user-email", decoded.email);

//         console.log("📧 Added headers:", {
//           "x-user-id": decoded._id,
//           "x-user-role": decoded.role,
//           "x-user-email": decoded.email,
//         });

//         return NextResponse.next({
//           request: {
//             headers: requestHeaders,
//           },
//         });
//       } catch (error) {
//         console.error("❌ Invalid token for API route:", error);
//         return NextResponse.json(
//           {
//             success: false,
//             message: "Invalid authentication token",
//           },
//           { status: 401 }
//         );
//       }
//     }

//     // Redirect authenticated users away from auth pages
//     if (authToken && url.pathname.startsWith("/microestate/auth")) {
//       console.log("↩️ Redirecting authenticated user from auth page");
//       return NextResponse.redirect(new URL("/microestate", request.url));
//     }

//     // Check if user is authenticated for protected routes
//     if (
//       url.pathname.startsWith("/microestate/profile") ||
//       url.pathname.startsWith("/microestate/dashboard") ||
//       url.pathname.startsWith("/microestate/landlord") ||
//       url.pathname.startsWith("/microestate/tenant")
//     ) {
//       if (!authToken) {
//         console.log(
//           "❌ No auth token for protected route, redirecting to auth"
//         );
//         return NextResponse.redirect(new URL("/microestate/auth", request.url));
//       }

//       // Verify token
//       try {
//         console.log("🔐 Verifying JWT token for protected route...");
//         const jwtSecret = process.env.NEXTAUTH_SECRET;
//         if (!jwtSecret) {
//           console.error(
//             "❌ NEXTAUTH_SECRET is not defined in environment variables"
//           );
//           throw new Error("NEXTAUTH_SECRET is not defined");
//         }

//         const decoded = jwt.verify(authToken, jwtSecret) as JWTPayload;

//         // Add user info to headers for protected routes
//         const requestHeaders = new Headers(request.headers);
//         requestHeaders.set("x-user-id", decoded._id);
//         requestHeaders.set("x-user-role", decoded.role);
//         requestHeaders.set("x-user-email", decoded.email);

//         return NextResponse.next({
//           request: {
//             headers: requestHeaders,
//           },
//         });
//       } catch (error) {
//         console.error("❌ Invalid token for protected route:", error);
//         // Invalid token - redirect to auth
//         const response = NextResponse.redirect(
//           new URL("/microestate/auth", request.url)
//         );
//         // response.cookies.delete("microauth");
//         return response;
//       }
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.error("💥 Middleware error:", error);
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: [
//     // Fixed the typo: "micorestate" -> "/microestate"
//     "/microestate/landlord/:path*",
//     "/microestate/tenant/:path*",
//     "/microestate/profile/:path*",
//     "/microestate/dashboard/:path*",
//     "/microestate/auth/:path*",
//     "/microestate/api/:path*", // This will catch your properties API
//   ],
// };

// /**
//  * Landlord authorization middleware
//  * Ensures user has landlord role
// //  */
// // export const requireLandlord = (handler: Function) => {
// //   return async (request: NextRequest, context?: any) => {
// //     console.log("🏠 RequireLandlord middleware called");

// //     const headers = new Headers(request.headers);
// //     const userId = headers.get("x-user-id");
// //     const userRole = headers.get("x-user-role") as "landlord" | "tenant";
// //     const userEmail = headers.get("x-user-email");

// //     console.log("📋 Headers received:", { userId, userRole, userEmail });

// //     if (!userId) {
// //       console.log("❌ No userId in headers");
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "Authentication required.",
// //         },
// //         {
// //           status: 401,
// //         }
// //       );
// //     }

// //     if (userRole !== "landlord") {
// //       console.log("❌ User is not a landlord:", userRole);
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "Access denied. Landlord role required.",
// //         },
// //         {
// //           status: 403,
// //         }
// //       );
// //     }

// //     console.log("✅ Landlord authorization successful");
// //     return handler(request, { userId, userRole, userEmail });
// //   };
// // };

// // /**
// //  * Tenant authorization middleware
// //  */
// // export const requireTenant = (handler: Function) => {
// //   return async (request: NextRequest, context?: any) => {
// //     console.log("🏠 RequireTenant middleware called");

// //     const headers = new Headers(request.headers);
// //     const userId = headers.get("x-user-id");
// //     const userRole = headers.get("x-user-role") as "landlord" | "tenant";
// //     const userEmail = headers.get("x-user-email");

// //     if (!userId) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "Authentication required.",
// //         },
// //         {
// //           status: 401,
// //         }
// //       );
// //     }

// //     if (userRole !== "tenant") {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "Access denied. Tenant role required.",
// //         },
// //         {
// //           status: 403,
// //         }
// //       );
// //     }

// //     return handler(request, { userId, userRole, userEmail });
// //   };
// // };
