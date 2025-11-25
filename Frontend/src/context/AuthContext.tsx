/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      // Backend responds with: { success, message, data: { user, token } }
      const payload = response.data?.data ?? response.data;
      const token = payload?.token;
      const userData = payload?.user;

      if (token && userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Welcome back!');
      } else {
        // Fallback: still attempt to parse top-level if shape differs
        const { token: t, user: u } = response.data || {};
        if (t && u) {
          localStorage.setItem('token', t);
          localStorage.setItem('user', JSON.stringify(u));
          setUser(u);
          toast.success('Welcome back!');
        } else {
          throw new Error('Invalid login response');
        }
      }
    } catch (error: unknown) {
      type APIError = { response?: { data?: { message?: string } } };
      const message = (error as APIError).response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ username, email, password });
      // Backend responds with: { success, message, data: { user, token } }
      const payload = response.data?.data ?? response.data;
      const token = payload?.token;
      const userData = payload?.user;

      if (token && userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Account created successfully!');
      } else {
        const { token: t, user: u } = response.data || {};
        if (t && u) {
          localStorage.setItem('token', t);
          localStorage.setItem('user', JSON.stringify(u));
          setUser(u);
          toast.success('Account created successfully!');
        } else {
          throw new Error('Invalid register response');
        }
      }
    } catch (error: unknown) {
      type APIError = { response?: { data?: { message?: string } } };
      const message = (error as APIError).response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
