// lib/imagekit.ts

import ImageKit from "imagekit";

// Validate required environment variables
const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (!publicKey) {
  throw new Error('IMAGEKIT_PUBLIC_KEY environment variable is required');
}

if (!privateKey) {
  throw new Error('IMAGEKIT_PRIVATE_KEY environment variable is required');
}

if (!urlEndpoint) {
  throw new Error('IMAGEKIT_URL_ENDPOINT environment variable is required');
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,   
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export default imagekit;
