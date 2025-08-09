import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";
import dynamic from 'next/dynamic';
import { Toaster } from "sonner";

// Dynamically import the PremiumPopup component with no SSR to avoid hydration issues
const PremiumPopup = dynamic(() => import('@/components/ui/PremiumPopup'));

// Dynamically import the ChatBot component with no SSR to avoid hydration issues
const ChatBotWrapper = dynamic(() => import('@/components/ui/ChatBotWrapper'));

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Algoric - AI-Powered Real Estate Platform | Find Your Dream Property",
  description: "Discover your perfect property with Settle's AI-powered real estate platform. Explore verified listings, virtual tours, smart tools, and connect with top agents and premium builders across India.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/tabIcon.png", sizes: "1024x1024", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/tabIcon.png",
  },
  robots: 'index, follow',
  authors: [{ name: 'Settle Team' }],
  keywords: 'real estate, AI property search, virtual tours, property listings, real estate agents, builders, Delhi properties, Mumbai properties, Gurgaon properties, buy property, sell property, rent property, property investment, smart home integration, property price prediction',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6600',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//ik.imagekit.io" />
        <meta name="theme-color" content="#FF6600" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <AuthProvider>
          {children}
          <PremiumPopup />
          <ChatBotWrapper />
        </AuthProvider>
        
      </body>
    </html>
  );
}
