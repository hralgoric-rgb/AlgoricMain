import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/utils";
import connectDB from "@/app/lib/mongodb";

// Email template for share purchase notification
function getSharePurchaseEmailTemplate(data: {
  propertyName: string;
  propertyId: string;
  shareCount: number;
  totalAmount: number;
  userName: string;
  userEmail: string;
  userPhone?: string;
  propertyLocation?: string;
  pricePerShare: number;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 700px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #a78bfa, #8b5cf6);
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .property-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #a78bfa;
        }
        .user-details {
          background: #e8f5e8;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #22c55e;
        }
        .highlight {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-label {
          font-weight: bold;
          color: #555;
        }
        .detail-value {
          color: #333;
        }
        .urgent {
          background: #fee2e2;
          color: #dc2626;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #fecaca;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏢 New Share Purchase Request</h1>
          <p>A customer wants to buy equity shares</p>
        </div>
        
        <div class="content">
          <div class="urgent">
            <strong>⚡ URGENT:</strong> A customer has expressed interest in purchasing equity shares. Please contact them within 24 hours.
          </div>
          
          <div class="highlight">
            💰 Total Investment: ₹${data.totalAmount.toLocaleString()}
          </div>
          
          <div class="property-details">
            <h3>🏠 Property Details</h3>
            <div class="detail-row">
              <span class="detail-label">Property Name:</span>
              <span class="detail-value">${data.propertyName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Property ID:</span>
              <span class="detail-value">${data.propertyId}</span>
            </div>
            ${data.propertyLocation ? `
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${data.propertyLocation}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="detail-label">Number of Shares:</span>
              <span class="detail-value">${data.shareCount.toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Price per Share:</span>
              <span class="detail-value">₹${data.pricePerShare.toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span class="detail-value">₹${data.totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="user-details">
            <h3>👤 Customer Details</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${data.userName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${data.userEmail}</span>
            </div>
            ${data.userPhone ? `
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${data.userPhone}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="detail-label">Timestamp:</span>
              <span class="detail-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
            </div>
          </div>
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📋 Next Steps:</h3>
            <ul>
              <li>Contact the customer within 24 hours</li>
              <li>Verify their investment capacity and intent</li>
              <li>Guide them through the KYC process if needed</li>
              <li>Arrange the share purchase documentation</li>
              <li>Process the payment and share allocation</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} 100गज Properties. All rights reserved.</p>
          <p>This is an automated notification from the 100गज Equity Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Customer confirmation email template
function getCustomerConfirmationEmailTemplate(data: {
  propertyName: string;
  shareCount: number;
  totalAmount: number;
  userName: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #a78bfa, #8b5cf6);
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .success-banner {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Thank You for Your Interest!</h1>
          <p>Your equity share purchase request has been received</p>
        </div>
        
        <div class="content">
          <p>Dear ${data.userName},</p>
          
          <div class="success-banner">
            ✅ We have received your interest to purchase ${data.shareCount.toLocaleString()} shares of "${data.propertyName}" for ₹${data.totalAmount.toLocaleString()}
          </div>
          
          <p>Our investment team will contact you within <strong>24 hours</strong> to:</p>
          <ul>
            <li>Verify your investment details</li>
            <li>Guide you through the documentation process</li>
            <li>Help you complete any required KYC verification</li>
            <li>Finalize your share purchase</li>
          </ul>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Review the property details and documentation</li>
            <li>Prepare any required identity documents</li>
            <li>Contact us if you have any questions</li>
          </ul>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📞 Contact Information:</h3>
            <p><strong>Email:</strong> support@100gaj.com<br>
            <strong>Phone:</strong> +91-XXXX-XXXX-XX</p>
          </div>
          
          <p>Thank you for choosing 100गज for your real estate investment needs!</p>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} 100गज Properties. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getUserIdFromAuthHeader(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.substring(7);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.userId || payload.sub;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const data = await req.json();
    const {
      propertyName,
      propertyId,
      shareCount,
      totalAmount,
      pricePerShare,
      propertyLocation,
      userName,
      userEmail,
      userPhone
    } = data;

    // Validate required fields
    if (!propertyName || !propertyId || !shareCount || !totalAmount || !userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user info from token if available
    const authHeader = req.headers.get("authorization");
    const userId = getUserIdFromAuthHeader(authHeader);

    // Prepare email data
    const emailData = {
      propertyName,
      propertyId,
      shareCount: Number(shareCount),
      totalAmount: Number(totalAmount),
      pricePerShare: Number(pricePerShare),
      propertyLocation,
      userName,
      userEmail,
      userPhone
    };

    // Send notification email to admin/company
    const adminEmail = process.env.EMAIL_SERVER_USER || "admin@100gaj.com"; // Set this in your environment variables
    const adminEmailSubject = `🚨 New Share Purchase Request - ₹${totalAmount.toLocaleString()} Investment`;
    const adminEmailHtml = getSharePurchaseEmailTemplate(emailData);

    await sendEmail(adminEmail, adminEmailSubject, adminEmailHtml);

    // Send confirmation email to customer
    const customerEmailSubject = `Thank you for your interest in ${propertyName} - 100गज Properties`;
    const customerEmailHtml = getCustomerConfirmationEmailTemplate({
      propertyName,
      shareCount: Number(shareCount),
      totalAmount: Number(totalAmount),
      userName
    });

    await sendEmail(userEmail, customerEmailSubject, customerEmailHtml);

    // Log the purchase interest (you might want to save this to database)
    console.log('Share purchase interest logged:', {
      userId,
      propertyId,
      propertyName,
      shareCount,
      totalAmount,
      userEmail,
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "Purchase interest recorded successfully. You will be contacted soon."
    });

  } catch (error) {
    console.error("Error processing purchase notification:", error);
    return NextResponse.json(
      { error: "Failed to process purchase notification" },
      { status: 500 }
    );
  }
}
