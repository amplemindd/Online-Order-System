import React, { createContext, useContext, useState } from 'react';
import { Product } from './CartContext';

type WishlistContextType = {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const addToWishlist = (product: Product) => {
    setWishlistItems(current =>
      current.some(item => item.id === product.id)
        ? current
        : [...current, product],
    );
  };

  const removeFromWishlist = (id: number) => {
    setWishlistItems(current => current.filter(item => item.id !== id));
  };

  const toggleWishlist = (product: Product) => {
    setWishlistItems(current =>
      current.some(item => item.id === product.id)
        ? current.filter(item => item.id !== product.id)
        : [...current, product],
    );
  };

  const isWishlisted = (id: number) =>
    wishlistItems.some(item => item.id === id);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
      }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used inside WishlistProvider');
  }

  return context;
};