import dbConnect from "@/app/(microestate)/lib/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(microestate)/models/user";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
  
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await User.findOne({ email: credentials.email }).select("+password").lean();
        
        if (!user) throw new Error("Invalid credentials");
        
        const isValid = await bcrypt.compare(
          credentials.password, 
          user.password
        );
        
        if (!isValid) throw new Error("Invalid credentials");
        
        return {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          image: user.profileImage || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        
        // Remove sensitive fields
        session.user = {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
          image: session.user.image,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/signIn",
    error: "/signIn",
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 days 
  },
  secret: process.env.NEXTAUTH_SECRET,
  
};