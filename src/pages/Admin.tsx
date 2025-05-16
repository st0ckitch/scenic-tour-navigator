
import React, { useEffect } from 'react';
import AdminTourPanel from '@/components/admin/AdminTourPanel';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { loading, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is logged in and redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin && user) {
      navigate('/');
    }
  }, [loading, isAdmin, user, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-travel-sky" />
      </div>
    );
  }
  
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminTourPanel />
    </ProtectedRoute>
  );
};

export default Admin;
