import React from 'react';
import { Metadata } from 'next';
// import Sidebar from '@/components/microestate/AgentSidebar';
// import Navbar from '@/components/Navbar';
// import '@/styles/microestate.module.css';
import AuthProvider from '../Context/AuthProvider';

export const metadata: Metadata = {
  title: 'Microestate Dashboard | 100गज',
  description: 'Manage properties, listings, and insights.',
};

export default function MicroestateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1">
        <main className="">{children}</main>
      </div>
    </div>
    </AuthProvider>
  );
}
