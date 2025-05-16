
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-travel-sky" />
      </div>
    );
  }

  // For admin routes, check if the user exists and has admin role in user_metadata
  if (adminOnly) {
    if (!user) {
      // If not logged in at all, redirect to auth
      return <Navigate to="/auth?redirect=/admin" />;
    }
    
    // Optional: check for admin role in metadata
    // For now, we're just checking if the user has the email "admin@example.com"
    const isAdmin = user.email === "admin@example.com";
    
    if (!isAdmin) {
      // If logged in but not admin, redirect to home
      return <Navigate to="/" />;
    }
  } else if (!user) {
    // For non-admin routes, just check if user exists
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
