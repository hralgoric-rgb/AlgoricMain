import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";
import dynamic from 'next/dynamic';
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

// Dynamically import the PremiumPopup component with no SSR to avoid hydration issues
const PremiumPopup = dynamic(() => import('@/components/ui/PremiumPopup'));

const ActiveUsersCounter = dynamic(() => import('./components/ActiveUsersCounter'), {
  ssr: true
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "100 Gaj",
  description: "Housing Services for Everyone",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <AuthProvider>
          {children}
          <PremiumPopup />
          <ActiveUsersCounter />
        </AuthProvider>
        
      </body>
    </html>
  );
}
