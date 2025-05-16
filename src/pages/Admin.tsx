
import React, { useState, useEffect } from 'react';
import AdminPanel from '@/components/admin/AdminPanel';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Admin email for authentication
const ADMIN_EMAIL = 'admin@example.com';
// Password for admin access
const ADMIN_PASSWORD = 'admin123';

const Admin = () => {
  const { loading, isAdmin, adminSignIn } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user is already authenticated as admin
  if (!loading && isAdmin) {
    return <AdminPanel />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await adminSignIn(email, password);
    } catch (error) {
      console.error("Admin authentication error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-travel-sky" />
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-travel-coral hover:bg-orange-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Access Admin Panel"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
