# Equity Share Purchase Notification System

## Overview
When a user expresses interest in purchasing equity shares, the system now automatically sends email notifications to both the admin team and the customer.

## How It Works

### 1. User Flow
1. User clicks "Express Interest" on a property
2. User fills out the share purchase form
3. User agrees to terms and conditions
4. User clicks "Express Interest" button
5. System sends notifications and shows success message
6. User receives confirmation email
7. Admin team receives detailed notification

### 2. Email Notifications

#### Admin Notification Email
- **Sent to**: `ADMIN_EMAIL` environment variable
- **Subject**: "🚨 New Share Purchase Request - ₹X Investment"
- **Contains**:
  - Property details (name, ID, location)
  - Investment details (shares, amount, price per share)
  - Customer details (name, email, phone)
  - Timestamp
  - Next steps checklist

#### Customer Confirmation Email
- **Sent to**: Customer's email address
- **Subject**: "Thank you for your interest in [Property Name] - 100गज Properties"
- **Contains**:
  - Confirmation of interest received
  - Investment summary
  - Next steps information
  - Contact information
  - Timeline (24-hour contact promise)

### 3. API Endpoint
- **URL**: `/api/equity/purchase-notification`
- **Method**: POST
- **Authentication**: Optional (Bearer token)
- **Payload**:
  ```json
  {
    "propertyName": "string",
    "propertyId": "string",
    "shareCount": "number",
    "totalAmount": "number",
    "pricePerShare": "number",
    "propertyLocation": "string",
    "userName": "string",
    "userEmail": "string",
    "userPhone": "string"
  }
  ```

### 4. Environment Variables Required
Make sure these are set in your `.env` file:

```bash
# Email Configuration
EMAIL_SERVER_HOST=smtp.your-provider.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@domain.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=no-reply@algoric.com
EMAIL_SERVER_SECURE=false

# Admin Notification Email
ADMIN_EMAIL=admin@100gaj.com
```

### 5. User Authentication
The system works with both authenticated and non-authenticated users:
- **Authenticated users**: User details are extracted from JWT token
- **Non-authenticated users**: Must provide email and name manually

### 6. Error Handling
- Email sending failures are logged
- User receives appropriate error messages
- Fallback mechanisms in place

## Implementation Details

### Files Modified/Created
1. `/app/api/equity/purchase-notification/route.ts` - New API endpoint
2. `/app/commercial/components/BuySharesModal.tsx` - Updated modal
3. `/app/equity/property/[id]/page.tsx` - Updated button text
4. `.env.example` - Added ADMIN_EMAIL variable

### Dependencies
- Uses existing `sendEmail` utility from `/app/lib/utils.ts`
- Requires nodemailer (already installed)
- Uses existing authentication system

## Testing
1. Set up email environment variables
2. Create a test property
3. Express interest in shares
4. Check both admin email and customer email
5. Verify email content and formatting

## Future Enhancements
- Save purchase interests to database
- Add email templates customization
- Implement automated follow-up emails
- Add SMS notifications
- Create admin dashboard for managing interests
