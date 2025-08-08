import React from 'react';
import ProtectedRoute from '../../_components/ProtectedRoute';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['tenant']}>
      {children}
    </ProtectedRoute>
  );
}
