import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

const USER_STORAGE_KEY = '@upsc_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  // Check for existing user session on app launch
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const hasLaunched = await AsyncStorage.getItem('@has_launched');
      
      if (userData) {
        setUser(JSON.parse(userData));
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
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
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

