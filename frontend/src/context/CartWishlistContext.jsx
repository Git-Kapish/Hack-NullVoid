import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { api } from '../api/client';

const CartWishlistContext = createContext(null);

export function CartWishlistProvider({ children }) {
  const { membershipTier } = useAuth();
  const { addToast } = useToast();

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('shopsmart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('shopsmart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shopsmart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopsmart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1) => {
    if (product.availability === 'OUT_OF_STOCK') {
      addToast(`${product.name} is currently out of stock.`, 'warning');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      const maxStock = product.stockCount ?? 99;

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        addToast(`Updated quantity of ${product.name} in cart`, 'info');
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const initialQty = Math.min(quantity, maxStock);
        addToast(`Added ${product.name} to cart`, 'success');
        return [...prev, { product, quantity: initialQty }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const maxStock = item.product.stockCount ?? 99;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        addToast(`Removed ${product.name} from wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        addToast(`Added ${product.name} to wishlist`, 'success');
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Shipping rule: Free for Prime and Premium, or orders over $50
  const isFreeShipping = membershipTier === 'PRIME' || membershipTier === 'PREMIUM' || subtotal >= 50 || subtotal === 0;
  const shipping = isFreeShipping ? 0 : 4.99;
  
  // Simulated tax (8.25%)
  const tax = subtotal > 0 ? subtotal * 0.0825 : 0;
  const total = subtotal + shipping + tax;
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const checkoutSimulatedOrder = async () => {
    if (cart.length === 0) return null;

    const orderPayload = {
      items: cart.map(item => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0]
      })),
      total_amount: parseFloat(total.toFixed(2))
    };

    const newOrder = await api.post('/orders/simulate', orderPayload);
    clearCart();
    addToast(`Order ${newOrder.order_number} successfully placed!`, 'success');
    return newOrder;
  };

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        wishlistCount: wishlist.length,
        subtotal,
        shipping,
        tax,
        total,
        isFreeShipping,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        checkoutSimulatedOrder
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within CartWishlistProvider');
  }
  return context;
}
