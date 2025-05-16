
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

type AuthContextType = {
  isAdmin: boolean;
  loading: boolean;
  adminSignIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session check:", session?.user?.email);
      setSession(session);
      
      // Check if the user is admin (email is admin@example.com)
      if (session?.user) {
        const userIsAdmin = session.user.email === "admin@example.com";
        setIsAdmin(userIsAdmin);
      }
      
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        
        // Check if the user is admin (email is admin@example.com)
        if (session?.user) {
          const userIsAdmin = session.user.email === "admin@example.com";
          setIsAdmin(userIsAdmin);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const adminSignIn = async (email: string, password: string) => {
    try {
      console.log("Admin signing in with:", email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log("Sign in successful:", data.user?.email);
      
      const userIsAdmin = data.user?.email === "admin@example.com";
      if (!userIsAdmin) {
        await supabase.auth.signOut();
        throw new Error("This account does not have admin privileges");
      }
      
      toast({
        title: "Login successful",
        description: "You have been logged in as admin successfully.",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, adminSignIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
