import React from 'react';
import LandlordNavbar from './components/LandlordNavbar';

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <LandlordNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
} 