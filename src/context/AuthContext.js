'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const { showToast } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Load user-specific wishlist from localStorage when user state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        const wishlistKey = `pet_wishlist_${user.email}`;
        const stored = localStorage.getItem(wishlistKey);
        if (stored) {
          try {
            setWishlist(JSON.parse(stored));
          } catch (e) {
            console.error('Failed to parse wishlist', e);
            setWishlist([]);
          }
        } else {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
  }, [user]);

  // Fetch current user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Content-Type': 'application/json',
          },
          // Send credentials (cookies) with request
          credentials: 'include',
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Session verification failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [API_URL]);

  // Handle local registration
  const register = async (name, email, photoUrl, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, photoUrl, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Successful registration sets user and cookie
      setUser(data.user);
      showToast('Registration successful! Welcome to Pet Adoption Portal.', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle local login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      showToast('Welcome back!', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle Real Google Login
  const googleLogin = async (credential) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google Login failed');
      }

      setUser(data.user);
      showToast('Google Sign-In successful!', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      showToast('Logged out successfully.', 'info');
    } catch (err) {
      console.error('Logout error:', err);
      showToast('Error logging out. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Wishlist Functions
  const toggleWishlist = (petId) => {
    if (!user) {
      showToast('Please log in to manage your wishlist', 'info');
      return;
    }

    let updated;
    if (wishlist.includes(petId)) {
      updated = wishlist.filter((id) => id !== petId);
      showToast('Removed from wishlist.', 'info');
    } else {
      updated = [...wishlist, petId];
      showToast('Added to wishlist!', 'success');
    }
    setWishlist(updated);
    localStorage.setItem(`pet_wishlist_${user.email}`, JSON.stringify(updated));
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthContext.Provider
        value={{
          user,
          loading,
          wishlist,
          toggleWishlist,
          register,
          login,
          googleLogin,
          logout,
          apiUrl: API_URL,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
