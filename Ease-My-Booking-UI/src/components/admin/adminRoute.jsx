import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { isLoggedIn, role } = useSelector((state) => state.user);

  // Check if user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has admin role
  const isAdmin = Array.isArray(role) ? role.includes('Admin') : role === 'Admin';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
