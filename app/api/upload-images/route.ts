import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to validate file type
const isValidFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  return allowedTypes.includes(file.type);
};

// Helper function to convert File to Buffer
const fileToBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer: Buffer, filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: '100gaj',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: filename.split('.')[0], // Use filename without extension as public_id
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    // Check if file exists
    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidFileType(file)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPG, JPEG, and PNG files are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (optional - limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await fileToBuffer(file);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, file.name);

    // Return success response
    return NextResponse.json(
      {
        message: 'Image uploaded successfully',
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Upload error:', error);
    
    // Handle specific Cloudinary errors
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json(
        { message: `Upload failed: ${error.message}` },
        { status: 500 }
      ); 
    }

    // Generic error response
    return NextResponse.json(
      { message: 'Internal server error during file upload' },
      { status: 500 }
    );
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to upload files.' },
    { status: 405 }
  );
}