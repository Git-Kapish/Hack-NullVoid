import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('shopsmart_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopsmart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await api.get('/auth/me');
        setUser(userData);
        localStorage.setItem('shopsmart_user', JSON.stringify(userData));
      } catch (err) {
        console.warn('Session restoration failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadCurrentUser();
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('shopsmart_token', newToken);
    localStorage.setItem('shopsmart_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('shopsmart_token');
    localStorage.removeItem('shopsmart_user');
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    membershipTier: user?.membership_tier || 'BASIC',
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
