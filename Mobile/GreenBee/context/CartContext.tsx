import React, { createContext, useContext, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: ImageSourcePropType;
};

export type CartItem = Product & {
  quantity: number;
  size?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  increaseQuantity: (id: number, size?: string) => void;
  decreaseQuantity: (id: number, size?: string) => void;
  removeFromCart: (id: number, size?: string) => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size?: string) => {
    setCartItems(current => {
      const existing = current.find(
        item => item.id === product.id && item.size === size,
      );

      if (existing) {
        return current.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1, size }];
    });
  };

  const increaseQuantity = (id: number, size?: string) => {
    setCartItems(current =>
      current.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (id: number, size?: string) => {
    setCartItems(current =>
      current
        .map(item =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter(item => item.quantity > 0),
    );
  };

  const removeFromCart = (id: number, size?: string) => {
    setCartItems(current =>
      current.filter(item => !(item.id === id && item.size === size)),
    );
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        cartCount,
        cartTotal,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
};