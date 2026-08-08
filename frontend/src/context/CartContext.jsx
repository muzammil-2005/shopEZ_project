import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastInfo, setToastInfo] = useState({ show: false, product: null });

  const showToast = (product) => {
    setToastInfo({ show: true, product });
    setTimeout(() => {
      setToastInfo({ show: false, product: null });
    }, 4000);
  };

  const hideToast = () => {
    setToastInfo({ show: false, product: null });
  };

  const fetchCart = async () => {
    if (!user) {
      const localCart = localStorage.getItem('shopez_cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          setCart({ items: [], totalPrice: 0 });
        }
      } else {
        setCart({ items: [], totalPrice: 0 });
      }
      return;
    }

    try {
      setLoading(true);
      // Auto-sync guest cart items to MongoDB upon login
      const savedGuestCart = localStorage.getItem('shopez_cart');
      if (savedGuestCart) {
        try {
          const parsed = JSON.parse(savedGuestCart);
          if (parsed.items && parsed.items.length > 0) {
            for (const item of parsed.items) {
              const pid = item.product?._id || item.product;
              await API.post('/cart', { productId: pid, quantity: item.quantity }).catch(() => {});
            }
          }
          localStorage.removeItem('shopez_cart');
        } catch (e) {
          console.warn('Guest cart sync error:', e);
        }
      }

      const { data } = await API.get('/cart');
      setCart(data || { items: [], totalPrice: 0 });
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('shopez_user');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const isInCart = (productId) => {
    if (!cart || !cart.items) return false;
    return cart.items.some((i) => (i.product?._id || i.product) === productId);
  };

  const addToCartGuest = (productId, quantity, productDetails) => {
    const currentItems = cart.items ? [...cart.items] : [];
    const existingIndex = currentItems.findIndex(
      (i) => (i.product?._id || i.product) === productId
    );

    let targetProduct = productDetails;

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += quantity;
      targetProduct = currentItems[existingIndex].product;
    } else if (productDetails) {
      currentItems.push({
        product: productDetails,
        quantity,
        price: productDetails.price,
      });
    }

    const totalPrice = currentItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const newCart = { items: currentItems, totalPrice };
    setCart(newCart);
    localStorage.setItem('shopez_cart', JSON.stringify(newCart));

    setIsCartOpen(true);
    if (targetProduct) showToast(targetProduct);
    return { success: true };
  };

  const addToCart = async (productId, quantity = 1, productDetails = null) => {
    if (!user) {
      return addToCartGuest(productId, quantity, productDetails);
    }

    try {
      setLoading(true);
      const { data } = await API.post('/cart', { productId, quantity });
      setCart(data || { items: [], totalPrice: 0 });
      setLoading(false);

      const addedItem = data && data.items
        ? data.items.find((i) => (i.product?._id || i.product) === productId)
        : null;
      const targetProduct = addedItem ? addedItem.product : productDetails;

      setIsCartOpen(true);
      if (targetProduct) showToast(targetProduct);

      return { success: true };
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.status === 401) {
        console.warn('401 detected in addToCart. Falling back to local cart...');
        localStorage.removeItem('shopez_user');
        return addToCartGuest(productId, quantity, productDetails);
      }

      return {
        success: false,
        message: err.response?.data?.message || 'Could not add to cart',
      };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    if (!user) {
      const currentItems = (cart.items || []).map((item) => {
        const id = item.product._id || item.product;
        if (id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      const totalPrice = currentItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const newCart = { items: currentItems, totalPrice };
      setCart(newCart);
      localStorage.setItem('shopez_cart', JSON.stringify(newCart));
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.put(`/cart/${productId}`, { quantity });
      setCart(data || { items: [], totalPrice: 0 });
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('shopez_user');
      }
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      const currentItems = (cart.items || []).filter(
        (item) => (item.product._id || item.product) !== productId
      );
      const totalPrice = currentItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const newCart = { items: currentItems, totalPrice };
      setCart(newCart);
      localStorage.setItem('shopez_cart', JSON.stringify(newCart));
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.delete(`/cart/${productId}`);
      setCart(data || { items: [], totalPrice: 0 });
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('shopez_user');
      }
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      setCart({ items: [], totalPrice: 0 });
      localStorage.removeItem('shopez_cart');
      return;
    }

    try {
      await API.delete('/cart');
      setCart({ items: [], totalPrice: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const cartItemCount = cart && cart.items
    ? cart.items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  const subtotal = cart && cart.items
    ? cart.items.reduce((acc, item) => acc + (item.price || item.product?.price || 0) * item.quantity, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartItemCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        isInCart,
        toastInfo,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
