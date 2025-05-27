import { NextConfig } from 'next';

const config: NextConfig = {
  images:{
    domains: ['via.placeholder.com','res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Fixes npm packages that depend on Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
      util: false,
      assert: false,
      url: false,
      querystring: false,
      buffer: false,
    };
    
    // Ignore bcrypt and other server-only packages
    config.externals = [
      ...(config.externals || []),
      'bcrypt',
      'jsonwebtoken',
      'nodemailer',
    ];
    
    return config;
  },
};

export default config;
