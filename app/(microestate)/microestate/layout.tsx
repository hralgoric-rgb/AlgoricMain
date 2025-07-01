// microestate layout
import React from 'react';
import { Metadata } from 'next';
// import Sidebar from '@/components/microestate/AgentSidebar';
// import Navbar from '@/components/Navbar';
// import '@/styles/microestate.module.css';

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
    <div className="flex min-h-screen">
      {/* Sidebar for agent/builder navigation */}
      {/* <Sidebar /> */}

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* <Navbar /> */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
