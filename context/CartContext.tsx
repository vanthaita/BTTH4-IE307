import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

import { useAuth } from './AuthContext';

import { CartItem } from '~/app/types/type';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const getCartKey = (userId: string | undefined) => {
    return userId ? `cartItems_${userId}` : null;
  };

  useEffect(() => {
    const loadCart = async () => {
      if (user?.id) {
        const cartKey = getCartKey(user.id);
        if (cartKey) {
          try {
            const storedCart = await AsyncStorage.getItem(cartKey);
            if (storedCart) {
              setCartItems(JSON.parse(storedCart));
            } else {
              setCartItems([]);
            }
          } catch (error) {
            console.error('Error loading cart data from AsyncStorage:', error);
          }
        }
      } else {
        setCartItems([]);
      }
    };

    loadCart();
  }, [user?.id]);

  useEffect(() => {
    const saveCart = async () => {
      if (user?.id) {
        const cartKey = getCartKey(user.id);
        if (cartKey) {
          try {
            await AsyncStorage.setItem(cartKey, JSON.stringify(cartItems));
          } catch (error) {
            console.error('Error saving cart data to AsyncStorage:', error);
          }
        }
      }
    };

    saveCart();
  }, [cartItems, user?.id]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex > -1) {
        const updatedItems = prevItems.map((cartItem, index) => {
          if (index === existingItemIndex) {
            return { ...cartItem, quantity: cartItem.quantity + item.quantity };
          }
          return cartItem;
        });
        return updatedItems;
      } else {
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
