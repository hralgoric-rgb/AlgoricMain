import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectDB from '@/app/lib/mongodb';
import Payment from '@/app/models/Payment';

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_key_secret';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

/**
 * Creates a Razorpay order for subscription plans
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { amount, userId, planType, planDuration, planName } = body;

    if (!amount || !userId || !planType || !planDuration) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      );
    }

    // Create a unique receipt ID
    const receipt = `subscription_${planType}_${Date.now()}`;
    
    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        userId,
        planType,
        planDuration,
        planName: planName || planType,
        paymentType: 'subscription'
      }
    };

    const order = await razorpay.orders.create(orderOptions);
    
    if (!order.id) {
      throw new Error('Failed to create Razorpay order');
    }

    // Save transaction to database
    await Payment.create({
      transactionId: order.id,
      userId,
      amount,
      planType,
      planDuration,
      status: 'initiated',
      paymentMethod: 'razorpay',
      responseData: {
        orderId: order.id,
        planName
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      receipt: order.receipt,
      notes: order.notes
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Verifies payment signature and updates payment status
 */
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required signature verification parameters' },
        { status: 400 }
      );
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValidSignature = generated_signature === razorpay_signature;

    if (!isValidSignature) {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { transactionId: razorpay_order_id },
        { 
          status: 'failed',
          responseData: { 
            error: 'Invalid signature',
            razorpay_payment_id,
            razorpay_signature 
          }
        }
      );

      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    // Update payment status in database
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      { 
        status: payment.status === 'captured' ? 'success' : 'failed',
        responseData: {
          ...payment,
          razorpay_payment_id,
          razorpay_signature,
          verified: true
        }
      },
      { new: true }
    );

    if (!updatedPayment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      status: payment.status,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: Number(payment.amount) / 100, // Convert back to rupees
      payment: updatedPayment
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed', details: error.message },
      { status: 500 }
    );
  }
}
