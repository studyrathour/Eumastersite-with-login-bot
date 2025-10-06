import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAdminAuthenticated, isUserAuthenticated } from '../utils/auth';

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  
  // Check if user is admin
  const isAdmin = isAdminAuthenticated();
  
  // Check if user has access
  const isUser = isUserAuthenticated();
  
  // Allow access to token verification page for unauthenticated users
  const isTokenPage = location.pathname === '/verify-token';
  
  // If user is admin, allow access to admin routes
  if (isAdmin) {
    return <Outlet />;
  }
  
  // If user has access, allow access to content
  if (isUser) {
    return <Outlet />;
  }
  
  // If user is on token page, allow access
  if (isTokenPage) {
    return <Outlet />;
  }
  
  // Redirect unauthenticated users to token verification page
  return <Navigate to="/verify-token" replace />;
};

export default ProtectedRoute;