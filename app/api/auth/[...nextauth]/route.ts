import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import connectDB from "@/app/lib/mongodb";
import clientPromise from "@/app/lib/mongodb-adapter";
import User from "@/app/models/User";

// Call connectDB to ensure mongoose is connected
connectDB().catch(console.error);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({profile }) {
      try {
        // Ensure mongoose connection is established
        await connectDB();

        // Check if user exists in your custom User model
        const email = profile?.email;
        if (!email) return false;

        let existingUser = await User.findOne({ email }).exec();

        if (!existingUser) {
          // Create a new user in your custom model
          existingUser = await User.create({
            name: profile?.name,
            email: email,
            emailVerified: new Date(),
            role: "agent",
            isAgent: true,
            authMethod: "google",
            image: profile?.image,
          });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
          {
            id: existingUser._id.toString(),
            email: existingUser.email,
            role: existingUser.role,
          },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" },
        );

        // Set cookie
        setCookie("authToken", jwtToken, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          httpOnly: false,
        });

        // Store token in session storage (will be done client-side)
        // We'll handle this in the navbar component

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
