import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type WishlistContextType = {
  wishlist: number[];
  toggleWishlist: (id: number) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const WISHLIST_STORAGE_KEY = '@buyforce_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Load wishlist from storage on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const stored = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const saveWishlist = async (newWishlist: number[]) => {
    try {
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];
      
      // Save to storage
      saveWishlist(newWishlist);
      
      return newWishlist;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
