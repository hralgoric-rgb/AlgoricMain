import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await User.findOne({ 
          email: credentials.email.toLowerCase().trim() 
        }).select("+password").lean();
        
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          _id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          firstName: user.firstName, // Add this
          lastName: user.lastName,   // Add this
          phone: user.phone,         // Add this
          emailVerified: user.emailVerified, // Add this
        };
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token._id = user._id || user.id;
        token.name = user.name;
        token.role = user.role;
        token.email = user.email;
      
          // Add additional fields
        token.phone = user.phone;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user._id = token._id;
        session.user.role = token.role;
        session.user.email = token.email;
         // Add additional fields to session
        session.user.phone = token.phone;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/microestate/auth/login",
    error: "/microestate/auth/login",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,

  // Complete cookies configuration to override ALL default cookie names
  cookies: {
    sessionToken: {
      name: "microauth", // Change this to match your signup route
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 24 * 60 * 60,
      },
    }
  }
}