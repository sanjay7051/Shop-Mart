import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (user.token) {
        localStorage.setItem('token', user.token);
        setIsAuthenticated(true);
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity, size) => {
    if (product.category === 'clothing' && !size) {
      toast.error('Please select a size');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => (item._id === product._id || item.id === product.id) && item.selectedSize === size);
      if (existing) {
        return prev.map((item) =>
          (item._id === product._id || item.id === product.id) && item.selectedSize === size
            ? { ...item, qty: (item.qty !== undefined ? item.qty : item.quantity) + quantity }
            : item
        );
      }
      // Ensure _id and qty are present
      return [...prev, { ...product, _id: product._id || product.id, qty: quantity, selectedSize: size }];
    });
    toast.success('Added to cart');
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, qty: (item.qty !== undefined ? item.qty : item.quantity) + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const currentQty = item.qty !== undefined ? item.qty : item.quantity;
          return { ...item, qty: Math.max(1, currentQty - 1) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast.info('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      }
      toast.success('Added to wishlist');
      return [...prev, productId];
    });
  };

  const logout = () => {
    setUser(null);
    clearCart();
    setWishlist([]);
    toast.info('Logged out');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        wishlist,
        toggleWishlist,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
