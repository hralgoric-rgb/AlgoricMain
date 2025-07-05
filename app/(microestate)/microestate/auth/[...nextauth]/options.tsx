import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/models/User";
import GoogleProvider from "next-auth/providers/google";


export const authOptions: NextAuthOptions = {

    providers: [
        CredentialsProvider({
          id: "credentials",
           name: "Credentials",
credentials: {
  identifier: { label: "Email or Username", type: "text" },
  password: { label: "Password", type: "password" },
},


      async authorize(credentials: any): Promise<any> {
        await dbConnect()

        try {
          const foundUser = await User.findOne({
            $or: [
              { email: credentials.identifer },
              { username: credentials.identifer }
            ]
          })
          if (!foundUser) {
            console.error("User not found with this email")
          }
          const isPasswordCorret = await bcrypt.compare(credentials.passowrd, foundUser.password)
          if (isPasswordCorret) {
            return foundUser
          } else {
            throw new Error("Passowrd is incorrect try again  ")
          }


        } catch (error: any) {
          throw new Error(error)
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token.id
        session.user.email = token.email
        session.user.role = token.role
      }
      return session;
    },
},

session: {
  strategy: "jwt"
},

secret: process.env.NEXTAUTH_SECRET
}

// google provider 
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Google client credentials are not set in environment variables.");
}

GoogleProvider({
  clientId,
  clientSecret
});
