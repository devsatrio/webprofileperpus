'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  userMetadata: any;
  loading: boolean;
  email: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userMetadata: null,
  loading: true,
  email: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session);
        
        if (isMounted) {
          if (session?.user) {
            console.log('User from session:', session.user.email);
            setUser(session.user);
            setUserMetadata(session.user.user_metadata);
            setEmail(session.user.email || null);
          } else {
            console.log('No session found');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) setLoading(false);
      }
    };

    // Initialize auth
    initAuth();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      
      if (isMounted) {
        if (session?.user) {
          setUser(session.user);
          setUserMetadata(session.user.user_metadata);
          setEmail(session.user.email || null);
        } else {
          setUser(null);
          setUserMetadata(null);
          setEmail(null);
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userMetadata, loading, email }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
