import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/models/User';
import dbConnect from '@/app/(microestate)/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        
   await dbConnect()

   const {password , email} = await request.json()

   if (!password || !email) {
    return Response.json({
        message: "Error Password is required!"
    } , {status: 401}) 
   }
   
   const foundUser  = await User.findOne({email: email})
   if (!foundUser) {
      return Response.json({
        message: "Email does not exist in our database"
    } , {status: 401}) 
   }
   
  const hashedPassowrd =   await bcrypt.hash(password , 10)

   foundUser.password = hashedPassowrd
   await foundUser.save()
   
    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );


    } catch (error) {
        console.log("Error while Editing the password" , error)
        return Response.json({
            message: "Error while handling Reset-password"
        } , {status: 500})
    }
}