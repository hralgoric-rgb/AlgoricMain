import { NextConfig } from "next";

const config: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Image optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.deccanchronicle.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hindustantimes.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thehindu.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.livemint.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ndtv.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.moneycontrol.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.economictimes.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.business-standard.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.financialexpress.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.businesstoday.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.cnbctv18.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.news18.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.news18.com',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features for better compatibility
  serverExternalPackages: [
    'mongoose', 
    'bcrypt',
    '@radix-ui/react-tabs',
    '@radix-ui/react-avatar',
    '@radix-ui/react-dialog',
    '@radix-ui/react-select',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-tooltip',
    '@radix-ui/react-popover',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-separator',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-switch',
    '@radix-ui/react-slider',
    'next-auth',
  ],

  webpack: (config, { isServer, dev }) => {
    // Only apply minimal fixes needed for the "exports is not defined" issue
    
    // Server-side configuration
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'bcrypt',
        'jsonwebtoken',
        'nodemailer',
        'mongodb',
        'mongoose',
        '@radix-ui/react-tabs',
        '@radix-ui/react-avatar',
        '@radix-ui/react-dialog',
        '@radix-ui/react-select',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-tooltip',
        '@radix-ui/react-popover',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-separator',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-switch',
        '@radix-ui/react-slider',
        'next-auth',
      ];
    }

    // Basic fallbacks for browser compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Module rules for better compatibility
    config.module.rules.push(
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      }
    );

    return config;
  },
};

export default config;
