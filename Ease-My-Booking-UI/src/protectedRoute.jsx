// src/utils/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = useSelector((state) => state.user);

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.some(role => user.role.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
