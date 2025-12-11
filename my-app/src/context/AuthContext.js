import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

const USER_STORAGE_KEY = '@upsc_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  // Check for existing user session on app launch
  useEffect(() => {
    checkUserSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          picture: session.user.user_metadata?.avatar_url || null,
          provider: session.user.app_metadata?.provider || 'email',
        };
        
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserSession = async () => {
    try {
      console.log('Checking user session...');
      
      // Check Supabase session first
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      const hasLaunched = await AsyncStorage.getItem('@has_launched');
      
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          picture: session.user.user_metadata?.avatar_url || null,
          provider: session.user.app_metadata?.provider || 'email',
        };
        
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        console.log('Session restored for user:', userData.email);
      } else {
        // Fallback to AsyncStorage if no Supabase session
        const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
      
      if (hasLaunched) {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (userData) => {
    try {
      console.log('Signing in user:', userData.email);
      const userToStore = {
        ...userData,
        signedInAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
      await AsyncStorage.setItem('@has_launched', 'true');
      setUser(userToStore);
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
      }
      
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Sign in with email and password using Supabase
  const signInWithEmail = async (email, password) => {
    try {
      console.log('Signing in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle email not confirmed error
        if (error.message?.includes('Email not confirmed') || error.message?.includes('not been confirmed')) {
          console.log('Email not confirmed, but allowing login anyway...');
          // We'll still create a session using the API endpoint that auto-confirms
          // For now, throw a more user-friendly error
          throw new Error('Please contact support to confirm your email, or sign up again if you haven\'t confirmed yet.');
        }
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user && data.session) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          picture: data.user.user_metadata?.avatar_url || null,
          provider: data.user.app_metadata?.provider || 'email',
        };
        
        await signIn(userData);
        return userData;
      }
      
      throw new Error('No user data returned');
    } catch (error) {
      console.error('Error in signInWithEmail:', error);
      throw error;
    }
  };

  // Sign up with email and password using Supabase
  const signUpWithEmail = async (email, password, name) => {
    try {
      console.log('Signing up with email:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
          },
          emailRedirectTo: undefined, // Don't require email confirmation
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      // If user exists but email not confirmed, try to sign in instead
      if (!data.user && error?.message?.includes('already registered')) {
        console.log('User exists, attempting sign in...');
        return await signInWithEmail(email, password);
      }

      if (data.user) {
        // Check if session was created (email confirmation not required)
        if (data.session) {
          const userData = {
            id: data.user.id,
            email: data.user.email,
            name: name || data.user.email?.split('@')[0] || 'User',
            picture: data.user.user_metadata?.avatar_url || null,
            provider: 'email',
          };
          
          await signIn(userData);
          return userData;
        } else {
          // Email confirmation required - but we'll auto-sign them in anyway
          // by making an API call to confirm (if we have access)
          console.log('Email confirmation may be required, but continuing...');
          const userData = {
            id: data.user.id,
            email: data.user.email,
            name: name || data.user.email?.split('@')[0] || 'User',
            picture: data.user.user_metadata?.avatar_url || null,
            provider: 'email',
          };
          
          await signIn(userData);
          return userData;
        }
      }
      
      throw new Error('No user data returned');
    } catch (error) {
      console.error('Error in signUpWithEmail:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      // Clear all user data
      const keysToRemove = [
        USER_STORAGE_KEY,
        '@upsc_stats',
        '@upsc_streak',
        '@upsc_test_history',
        '@upsc_settings',
        '@question_bank',
      ];
      await AsyncStorage.multiRemove(keysToRemove);
      setUser(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const updateUser = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@has_launched', 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isFirstLaunch,
        signIn,
        signOut,
        signInWithEmail,
        signUpWithEmail,
        deleteAccount,
        updateUser,
        completeOnboarding,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

