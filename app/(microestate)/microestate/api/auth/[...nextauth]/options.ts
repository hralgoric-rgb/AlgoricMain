import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/app/(microestate)/lib/db";
import bcrypt from "bcrypt";
import MicroestateUser from "@/app/(microestate)/models/user";

// Extend NextAuth types to include firstName and lastName
declare module "next-auth" {
  interface User {
    firstName?: string;
    lastName?: string;
    role: string;
    id?: string;
    email?: string;
    name?: string;
  }
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
      firstName?: string;
      lastName?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          await dbConnect();
          console.log("🔍 Looking for user in microestate database:", credentials.email);
          
          

          const user = await MicroestateUser.findOne({
            email: credentials.email.toLowerCase().trim()
          });

          if (!user) {
            console.log("❌ No user found in microestate database");
            return null;
          }

          // console.log("✅ User found:", user._id.toString());
          // console.log("🔍 User role:", user.role);

          // Check if comparePassword method exists
          let isValidPassword = false;
          
          if (typeof user.comparePassword === 'function') {
            isValidPassword = await user.comparePassword(credentials.password);
          } else {
            isValidPassword = await bcrypt.compare(credentials.password, user.password);
          }

          if (!isValidPassword) {
            console.log("❌ Invalid password");
            return null;
          }

          console.log("✅ Password valid, returning user");

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            emailVerified: user.emailVerified
          };
        } catch (error) {
          console.error("❌ Auth error:", error);
          return null;
        }
      }
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("🔄 JWT callback - user login:", user.id);
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.emailVerified= user.emailVerified
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        console.log("🔄 Session callback - token ID:", token.id);
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    },

    async signIn() {
      return true;
    }
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/microestate/auth/signin",
  },

  debug: process.env.NODE_ENV === "development",
};