import { NextRequest, NextResponse } from 'next/server';
import MicroestateUser from "@/app/(microestate)/models/user";
import dbConnect from '@/app/(microestate)/lib/db';
import { 
  generateVerificationCode, 
  sendEmail, 
  getPasswordResetEmailTemplate 
} from '@/app/lib/utils';


export async function POST(request: NextRequest) {
    await dbConnect()
    try {
        const {email} = await request.json()
        if (!email) {
            console.error("Email is required! ")
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const foundUser = await MicroestateUser.findOne({email})
        if (!foundUser) {
            return NextResponse.json(
                {error: 'Email does not exist in our database'},
                {status: 400}
            )
        }

        const resetCode = generateVerificationCode();
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); 
      
        foundUser.resetPasswordToken = resetCode;
        foundUser.resetPasswordExpires = resetTokenExpiry;
        

        await MicroestateUser.updateOne(
          { _id: foundUser._id },
          {
            $set: {
              resetPasswordToken: resetCode,
              resetPasswordExpires: resetTokenExpiry,
            }
          }
        );

        // Try to send email with proper error handling
        try {
            // Check if email configuration is available
            if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
                console.warn('Email configuration not available, skipping email send');
                return NextResponse.json(
                    { 
                        success: true, 
                        message: 'Password reset code generated successfully. Please check your email configuration.',
                        resetCode: resetCode, // Return the code for development/testing
                        userId: foundUser._id
                    },
                    { status: 200 }
                );
            }

            const emailTemplate = getPasswordResetEmailTemplate(resetCode);
            const emailSent = await sendEmail(email, 'Reset your password', emailTemplate);
            
            if (!emailSent) {
                return NextResponse.json(
                    { error: 'Failed to send reset email. Please try again.' },
                    { status: 500 }
                );
            }
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            // For development, return the reset code instead of failing
            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Password reset code generated. Email sending failed, but here is your reset code for testing.',
                    resetCode: resetCode,
                    userId: foundUser._id
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { 
                success: true, 
                message: 'Verification code send sucessfully Check your email ',
                userId: foundUser._id
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in password reset:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: 'An error occurred while processing your request' },
            { status: 500 }
        ); 
    }
}