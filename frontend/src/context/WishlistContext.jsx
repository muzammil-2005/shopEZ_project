import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(CartContext) || {};
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      const saved = localStorage.getItem('shopez_wishlist');
      setWishlist(saved ? JSON.parse(saved) : { products: [] });
      return;
    }

    try {
      setLoading(true);
      // Auto-sync guest wishlist items to MongoDB upon login
      const savedGuestWishlist = localStorage.getItem('shopez_wishlist');
      if (savedGuestWishlist) {
        try {
          const parsed = JSON.parse(savedGuestWishlist);
          if (parsed.products && parsed.products.length > 0) {
            for (const item of parsed.products) {
              const pid = item._id || item;
              await API.post('/wishlist', { productId: pid }).catch(() => {});
            }
          }
          localStorage.removeItem('shopez_wishlist');
        } catch (e) {
          console.warn('Guest wishlist sync error:', e);
        }
      }

      const { data } = await API.get('/wishlist');
      setWishlist(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch wishlist error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (product) => {
    const productId = product._id || product;

    if (!user) {
      const current = wishlist.products ? [...wishlist.products] : [];
      if (!current.some((p) => (p._id || p) === productId)) {
        current.push(product);
        const newW = { products: current };
        setWishlist(newW);
        localStorage.setItem('shopez_wishlist', JSON.stringify(newW));
      }
      return { success: true };
    }

    try {
      setLoading(true);
      const { data } = await API.post('/wishlist', { productId });
      setWishlist(data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || 'Could not add to wishlist',
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) {
      const current = wishlist.products
        ? wishlist.products.filter((p) => (p._id || p) !== productId)
        : [];
      const newW = { products: current };
      setWishlist(newW);
      localStorage.setItem('shopez_wishlist', JSON.stringify(newW));
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.delete(`/wishlist/${productId}`);
      setWishlist(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    if (!wishlist || !wishlist.products) return false;
    return wishlist.products.some((p) => (p._id || p) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
