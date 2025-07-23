"use client";

import React from 'react';
import Background from '../../_components/Background';
import ProtectedRoute from '../../_components/ProtectedRoute';

export default function TenantDashboard() {
  return (
    <ProtectedRoute allowedRoles={['tenant']} redirectTo="/microestate/auth">
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <Background />
        <div className="container mx-auto py-10 mt-24 relative z-10">
            <h1 className="text-3xl font-bold text-white">Tenant Dashboard Test</h1>
        </div>
      </div>
    </ProtectedRoute>
  );
} 