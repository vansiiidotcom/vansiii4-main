import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean; // Add loading state
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initialize as loading

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session);
        if (session?.user) {
          console.log('Initial session user email:', session.user.email);
          setUser(session.user);
          setIsAuthenticated(true);
          setIsAdmin(session.user.email?.toLowerCase() === 'ceo@vansiii.com');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        setIsAdmin(session.user.email?.toLowerCase() === 'ceo@vansiii.com');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      if (!data.user) {
        throw new Error('No user returned from login');
      }
      console.log('Login user email:', data.user.email);
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.email?.toLowerCase() === 'ceo@vansiii.com');
    } catch (err) {
      console.error('Login error:', err);
      throw err instanceof Error ? err : new Error('Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (err) {
      console.error('Logout error:', err);
      throw err instanceof Error ? err : new Error('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isAuthenticated, isAdmin, isLoading, login, logout };
};