import React from 'react';
import AdminDashboard from './adminDashboard/adminDashboard';
import AdminRoute from './adminRoute';

export default function AdminDashboardWrapper() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
}
