import React from 'react';
import { Metadata } from 'next';
import AuthProvider from '../Context/AuthProvider';

export const metadata: Metadata = {
  title: 'Settle Dashboard | 100गज',
  description: 'Manage properties, listings, and insights.',
};

export default function MicroestateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        {children}
      </div>
    </AuthProvider>
  );
}
