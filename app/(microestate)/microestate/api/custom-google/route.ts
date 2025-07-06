import { OAuth2Client } from "google-auth-library";
import User from "@/app/(microestate)/models/user";
import { generateToken } from "@/app/lib/utils";
import dbConnect from "@/app/(microestate)/lib/db";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

// Helper function to set CORS headers
const setCorsHeaders = (response: Response) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
};

export async function OPTIONS() {
  const response = new Response(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function POST(request: Request) {
  try {
    console.log("Received Google login request");

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    const { token } = await request.json();
    if (!token) {
      console.error("No token provided");
      const response = new Response(
        JSON.stringify({ message: "Token is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
      return setCorsHeaders(response);
    }

    console.log("Verifying Google token...");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      console.error("Invalid token: No payload");
      const response = new Response(
        JSON.stringify({ message: "Invalid token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
      return setCorsHeaders(response);
    }

    const { sub, email, name, picture } = payload;
    console.log("Token verified for user:", email);

    try {
      console.log("Connecting to database...");
      await dbConnect();
      console.log("Database connected");

      let user = await User.findOne({ googleId: sub });
      console.log("User found by googleId:", user ? "Yes" : "No");

      if (!user) {
        user = await User.findOne({ email });
        console.log("User found by email:", user ? "Yes" : "No");

        if (user) {
          if (!user.googleId) {
            console.log("Linking Google account to existing user");
            user.googleId = sub;
            await user.save();
          }
        } else {
          console.log("Creating new user");
          user = await User.create({
            googleId: sub,
            email,
            name,
            image: picture,
            emailVerified: new Date(),
            role: "tenant",
          });
        }
      }

      console.log("Generating auth token");
      const microauthToken = generateToken({
        userId: user._id,
        email: user.email,
      });

      console.log("Login successful");
      const successResponse = new Response(
        JSON.stringify({
          success: true,
          message: "Google login successful",
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token: microauthToken,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return setCorsHeaders(successResponse);
    } catch (dbError) {
      console.error("Database error:", dbError);
      const errorResponse = new Response(
        JSON.stringify({
          message: "Database error",
          error: dbError.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
      return setCorsHeaders(errorResponse);
    }
  } catch (err) {
    console.error("Google Auth Error:", err);
    const errorResponse = new Response(
      JSON.stringify({
        message: "Internal server error",
        error: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
    return setCorsHeaders(errorResponse);
  }
}
