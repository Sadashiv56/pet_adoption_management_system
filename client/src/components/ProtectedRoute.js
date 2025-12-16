import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Usage: <ProtectedRoute role="admin"><Admin /></ProtectedRoute>
const ProtectedRoute = ({ children, role }) => {
  const auth = useSelector(s => s.auth);
  // not logged in -> redirect to login
  if (!auth.token) return <Navigate to="/login" replace />;
  // if we have a token but user data isn't loaded yet, don't redirect — wait for fetchCurrentUser
  if (auth.token && !auth.user) return null;
  // role required and doesn't match -> redirect to dashboard
  if (role && auth.user?.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
};

export default ProtectedRoute;
