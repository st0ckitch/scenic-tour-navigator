
import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminTourPanel from '@/components/admin/AdminTourPanel';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-travel-sky" />
      </div>
    );
  }
  
  return (
    <ProtectedRoute>
      <AdminTourPanel />
    </ProtectedRoute>
  );
};

export default Admin;
