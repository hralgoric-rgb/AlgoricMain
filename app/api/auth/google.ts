import { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { token } = req.body;

    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) return res.status(401).json({ message: "Invalid token" });

    const { sub, email, name, picture } = payload;


    await connectDB(); // Connect to MongoDB

    // Check if user exists
    let user = await User.findOne({ googleId: sub });


    // If not, create a new user
    if (!user) {
    user = await User.create({
    googleId: sub,
    email,
    name,
    image: picture,
    emailVerified: new Date(), // optional, since Google verified email
    role: "user", // or default
  });
}


    return res.status(200).json({ user });
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
