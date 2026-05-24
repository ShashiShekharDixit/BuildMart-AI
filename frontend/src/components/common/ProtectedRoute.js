import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role } = useSelector(s => s.auth);
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}
