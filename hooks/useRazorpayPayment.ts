import { useState } from 'react';
import { toast } from 'sonner';

interface PaymentOptions {
  amount: number;
  planType: string;
  planDuration: string;
  planName: string;
  userId: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpayPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById('razorpay-script');
      
      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (paymentData: PaymentOptions) => {
    try {
      const response = await fetch('/api/payment/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentResponse: any) => {
    try {
      const response = await fetch('/api/payment/subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };

  const processPayment = async (options: PaymentOptions) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order
      const orderData = await createOrder(options);

      // Razorpay options
      const razorpayOptions: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Algoric',
        description: `${options.planName} Subscription`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verificationResult = await verifyPayment(response);
            
            if (verificationResult.success) {
              toast.success('Payment successful! Your subscription is now active.');
              options.onSuccess?.(verificationResult);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast.error(error.message || 'Payment verification failed');
            options.onError?.(error);
          }
        },
        prefill: {
          name: 'User', // You can get this from user session
          email: 'user@example.com', // You can get this from user session
          contact: '9999999999', // You can get this from user session
        },
        theme: {
          color: '#FF6600',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      // Create Razorpay instance and open
      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast.error(error.message || 'Payment processing failed');
      options.onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
  };
};
