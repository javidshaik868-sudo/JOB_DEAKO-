import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi';
import { getAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [refreshSession]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      setUser(res.user);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data) => {
    return authApi.signup(data);
  };

  const resendOTP = async (email) => authApi.resendOtp({ email });

  const verifyOTP = async (data) => {
    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp(data);
      setUser(res.user);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (data) => {
    return authApi.forgotPassword(data);
  };

  const resetPassword = async (data) => {
    return authApi.resetPassword(data);
  };

  const updateUserProfile = (profile) => {
    const updates = {};
    if (profile.name !== undefined) updates.name = profile.name;
    if (profile.avatar !== undefined) updates.avatar = profile.avatar;
    if (profile.title !== undefined) updates.headline = profile.title;
    if (profile.location !== undefined) updates.location = profile.location;
    if (profile.phone !== undefined) updates.phone = profile.phone;
    setUser((currentUser) => currentUser ? { ...currentUser, ...updates } : currentUser);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
    signup,
    resendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    updateUserProfile,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
