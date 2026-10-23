import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('shopsmart_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopsmart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Sync Clerk authentication when user signs in through Clerk widgets
  const clerkState = useUser();
  const clerkAuth = useClerkAuth();

  useEffect(() => {
    async function syncClerkSession() {
      if (clerkState?.isSignedIn && clerkState?.user) {
        try {
          const clerkJwt = await clerkAuth?.getToken?.();
          if (clerkJwt) {
            const u = clerkState.user;
            const primaryEmail = u.primaryEmailAddress?.emailAddress || `${u.id}@clerk.user`;
            const name = u.fullName || u.firstName || u.username || primaryEmail.split('@')[0];
            const role = u.publicMetadata?.role || 'CUSTOMER';
            const membershipTier = u.publicMetadata?.membership_tier || u.publicMetadata?.membershipTier || 'BASIC';
            const userData = {
              id: u.id,
              email: primaryEmail,
              name,
              firstName: u.firstName,
              lastName: u.lastName,
              role,
              membership_tier: membershipTier,
              membershipTier,
            };
            setToken(clerkJwt);
            setUser(userData);
            localStorage.setItem('shopsmart_token', clerkJwt);
            localStorage.setItem('shopsmart_user', JSON.stringify(userData));
          }
        } catch (err) {
          console.warn('Clerk session token sync failed:', err);
        }
      }
    }
    syncClerkSession();
  }, [clerkState?.isSignedIn, clerkState?.user]);

  useEffect(() => {
    async function loadCurrentUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await api.get('/auth/me');
        if (userData) {
          setUser(userData);
          localStorage.setItem('shopsmart_user', JSON.stringify(userData));
        }
      } catch (err) {
        console.warn('Session restoration failed:', err);
        // Only clear if no fallback user is cached
        if (!user) {
          logout();
        }
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
