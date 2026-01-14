import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, setAuthToken, User } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved auth data on app start
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('authToken');
      const savedUser = await AsyncStorage.getItem('user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setAuthToken(savedToken);
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Login started:', { email });
    try {
      console.log('📡 Calling API...');
      const response = await authApi.login({ email, password });
      console.log('✅ API response received:', response);
      
      setUser(response.user);
      setToken(response.token);
      setAuthToken(response.token);
      console.log('✅ State updated, user:', response.user.email, 'token exists:', !!response.token);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      console.log('✅ Saved to AsyncStorage');
      console.log('🎯 isAuthenticated should now be:', !!response.user && !!response.token);
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const register = async (fullName: string, email: string, phone: string, password: string) => {
    console.log('🔐 Register started:', { fullName, email, phone });
    try {
      console.log('📡 Calling authApi.register...');
      const response = await authApi.register({
        fullName,
        email,
        phone,
        password,
      });
      console.log('✅ Register response received:', response);
      
      setUser(response.user);
      setToken(response.token);
      setAuthToken(response.token);
      console.log('✅ State updated, user:', response.user.email, 'token exists:', !!response.token);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      console.log('✅ Saved to AsyncStorage');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setToken(null);
      setAuthToken(null);
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
  };

  const isAuthenticated = !!user && !!token;
  
  // Debug: Log whenever auth state changes
  React.useEffect(() => {
    console.log('🔄 Auth state changed:', { 
      hasUser: !!user, 
      hasToken: !!token, 
      isAuthenticated,
      isLoading 
    });
  }, [user, token, isAuthenticated, isLoading]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
