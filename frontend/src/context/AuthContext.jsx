import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shopez_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-validate stored user token on launch; clear if stale/invalid
  useEffect(() => {
    const verifyUser = async () => {
      if (user && user.token) {
        try {
          await API.get('/users/profile');
        } catch (err) {
          if (err.response && err.response.status === 401) {
            console.warn('Stale user token detected. Auto-clearing session...');
            setUser(null);
            localStorage.removeItem('shopez_user');
          }
        }
      }
    };
    verifyUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('shopez_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Invalid credentials.';
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  const register = async (name, email, password, phone, address) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/register', {
        name,
        email,
        password,
        phone,
        address,
      });
      setUser(data);
      localStorage.setItem('shopez_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopez_user');
    localStorage.removeItem('shopez_cart');
    localStorage.removeItem('shopez_wishlist');
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.put('/users/profile', profileData);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('shopez_user', JSON.stringify(updatedUser));
      setLoading(false);
      return { success: true, user: updatedUser };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed.';
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
