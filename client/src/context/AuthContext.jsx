import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile on initial mount if token exists
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('shopez_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.success) {
            setUser(res.data);
          }
        } catch (err) {
          console.warn('Authentication token expired or invalid');
          localStorage.removeItem('shopez_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('shopez_token', res.data.token);
      setUser(res.data);
      return res.data;
    }
  };

  const register = async (name, email, password, role = 'USER') => {
    const res = await API.post('/auth/register', { name, email, password, role });
    if (res.success) {
      localStorage.setItem('shopez_token', res.data.token);
      setUser(res.data);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('shopez_token');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const res = await API.put('/users/profile', userData);
    if (res.success) {
      setUser((prev) => ({ ...prev, ...res.data }));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
