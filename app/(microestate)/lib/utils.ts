import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
  // Configure transporter (you should use environment variables for these values)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  
  // Send email
  const info = await transporter.sendMail({
    from: `"Microestate 100GAJ Properties" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return info;
}

export function getTenantWelcomeEmailTemplate(data: {
  tenantName: string;
  password: string;
  propertyTitle: string;
  propertyAddress: string;
  landlordEmail: string;
  leaseStartDate: string;
  monthlyRent: number;
  loginUrl?: string;
}): string {
  const { 
    tenantName, 
    password, 
    propertyTitle, 
    propertyAddress, 
    landlordEmail, 
    leaseStartDate, 
    monthlyRent,
    loginUrl = `${process.env.NEXTAUTH_URL}/microestate/auth/login`
  } = data;

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
          border: 1px solid #eaeaea;
          border-radius: 8px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #f97316;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          border-radius: 8px 8px 0 0;
          margin: -20px -20px 20px -20px;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 10px;
        }
        .header h1 {
          color: white;
          margin: 10px 0;
          font-size: 24px;
        }
        .content {
          padding: 20px 0;
        }
        .welcome-message {
          background-color: #fef3c7;
          border-left: 4px solid #f97316;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .credentials-box {
          background-color: #e0f2fe;
          border: 2px solid #0284c7;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          text-align: center;
        }
        .credentials-title {
          color: #0284c7;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .credential-item {
          margin: 10px 0;
          font-size: 16px;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          background-color: #f1f5f9;
          padding: 8px 12px;
          border-radius: 4px;
          font-weight: bold;
          color: #1e293b;
          display: inline-block;
          margin-left: 10px;
        }
        .property-details {
          background-color: #f0fdf4;
          border: 1px solid #22c55e;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .property-title {
          color: #15803d;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .property-item {
          margin: 8px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .property-label {
          font-weight: bold;
          color: #374151;
        }
        .property-value {
          color: #1f2937;
        }
        .features-list {
          background-color: #fafafa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .features-list h3 {
          color: #374151;
          margin-top: 0;
        }
        .features-list ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .features-list li {
          margin: 5px 0;
          color: #4b5563;
        }
        .login-button {
          display: inline-block;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          text-align: center;
          box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);
          transition: all 0.3s ease;
        }
        .login-button:hover {
          box-shadow: 0 6px 8px rgba(249, 115, 22, 0.4);
          transform: translateY(-1px);
        }
        .warning-box {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          color: #dc2626;
          padding: 15px;
          margin: 20px 0;
          border-radius: 6px;
          border-left: 4px solid #dc2626;
        }
        .warning-icon {
          font-size: 18px;
          margin-right: 8px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
          margin-top: 30px;
        }
        .footer-links {
          margin: 10px 0;
        }
        .footer-links a {
          color: #f97316;
          text-decoration: none;
          margin: 0 10px;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            padding: 15px;
          }
          .property-item {
            flex-direction: column;
            align-items: flex-start;
          }
          .credential-value {
            display: block;
            margin: 5px 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://yourdomain.com/logo.png" alt="100GAJ Logo" class="logo">
          <h1>Welcome to 100GAJ MicroEstate</h1>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <h2 style="margin-top: 0; color: #92400e;">Hello ${tenantName}! 👋</h2>
            <p style="margin-bottom: 0;">Your landlord has created a tenant account for you and assigned you to a property. Welcome to the 100GAJ MicroEstate platform!</p>
          </div>

          <div class="credentials-box">
            <div class="credentials-title">🔐 Your Login Credentials</div>
            <div class="credential-item">
              <strong>Email:</strong>
              <span class="credential-value">${data.tenantEmail || 'Your registered email'}</span>
            </div>
            <div class="credential-item">
              <strong>Temporary Password:</strong>
              <span class="credential-value">${password}</span>
            </div>
          </div>

          <div class="warning-box">
            <span class="warning-icon">⚠️</span>
            <strong>Important Security Notice:</strong> Please change your password immediately after logging in for security purposes. Never share your login credentials with anyone.
          </div>

          <div class="property-details">
            <div class="property-title">🏠 Your New Property</div>
            <div class="property-item">
              <span class="property-label">Property Name:</span>
              <span class="property-value">${propertyTitle}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Address:</span>
              <span class="property-value">${propertyAddress}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Monthly Rent:</span>
              <span class="property-value" style="color: #15803d; font-weight: bold;">$${monthlyRent.toLocaleString()}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Lease Start Date:</span>
              <span class="property-value">${leaseStartDate}</span>
            </div>
            <div class="property-item">
              <span class="property-label">Landlord Contact:</span>
              <span class="property-value">${landlordEmail}</span>
            </div>
          </div>

          <div class="features-list">
            <h3>🚀 What You Can Do With Your Account</h3>
            <ul>
              <li><strong>View & Sign Lease Agreement:</strong> Review and digitally sign your lease documents</li>
              <li><strong>Online Rent Payments:</strong> Pay your rent securely with multiple payment options</li>
              <li><strong>Maintenance Requests:</strong> Submit and track maintenance requests easily</li>
              <li><strong>Payment History:</strong> View all your past payments and receipts</li>
              <li><strong>Document Management:</strong> Access important lease documents anytime</li>
              <li><strong>Profile Management:</strong> Update your contact information and preferences</li>
              <li><strong>Notifications:</strong> Receive important updates about your property</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="${loginUrl}" class="login-button">🏠 Login to Your Account</a>
          </div>

          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #374151;">Next Steps:</h4>
            <ol style="color: #4b5563; margin-bottom: 0;">
              <li>Click the login button above or visit our website</li>
              <li>Log in using your email and temporary password</li>
              <li>Change your password to something secure</li>
              <li>Complete your profile information</li>
              <li>Review and sign your lease agreement</li>
              <li>Set up your preferred payment method</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #eff6ff; border-radius: 6px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Need Help?</strong> Our support team is here to assist you!<br>
              Contact us at <a href="mailto:support@100gaj.com" style="color: #f97316;">support@100gaj.com</a> or call <strong>(555) 123-4567</strong>
            </p>
          </div>

          <p style="text-align: center; font-size: 16px; color: #059669; font-weight: bold;">
            Welcome to your new home! 🎉
          </p>
        </div>

        <div class="footer">
          <div class="footer-links">
            <a href="${process.env.NEXTAUTH_URL}/microestate">Dashboard</a> |
            <a href="${process.env.NEXTAUTH_URL}/microestate/help">Help Center</a> |
            <a href="${process.env.NEXTAUTH_URL}/microestate/contact">Contact Support</a>
          </div>
          <p>&copy; ${new Date().getFullYear()} 100GAJ MicroEstate. All rights reserved.</p>
          <p style="margin-top: 5px;">
            This email was sent because a landlord added you as a tenant on our platform.<br>
            If you believe this was sent in error, please contact us immediately.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #9ca3af;">
            100GAJ MicroEstate | 123 Business Ave, Suite 100 | City, State 12345
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}