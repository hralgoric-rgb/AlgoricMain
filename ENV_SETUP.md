# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-super-secure-nextauth-secret-key-here-make-it-long-and-random

# Google OAuth Configuration
# Get these from Google Cloud Console: https://console.cloud.google.com/
# Create OAuth 2.0 Client IDs and set redirect URI to: http://localhost:3001/api/auth/callback/google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/100gaj

# JWT Secret - Generate a strong random string
JWT_SECRET=your-jwt-secret-key-make-it-very-secure-and-random

# Email Configuration (Optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@100gaj.com

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Development Settings
NODE_ENV=development
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 Client IDs
5. Add authorized redirect URI: `http://localhost:3001/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env.local`

## Quick Setup Commands

```bash
# Install dependencies
npm install

# Install React 18 (downgrade from React 19)
npm install react@^18.3.1 react-dom@^18.3.1 @types/react@^18 @types/react-dom@^18

# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install

# Start development server
npm run dev
```

## Troubleshooting

### Google OAuth "redirect_uri_mismatch" Error
- Ensure `NEXTAUTH_URL` matches your development server URL
- Add the correct redirect URI in Google Cloud Console
- Make sure the port number matches (3001 in this case)

### React Hook Errors
- Ensure React version is 18.x, not 19.x
- Clear node_modules and reinstall dependencies
- Check for duplicate React instances

### Database Connection Issues
- Ensure MongoDB is running locally
- Check the `MONGODB_URI` connection string
- Verify database permissions 