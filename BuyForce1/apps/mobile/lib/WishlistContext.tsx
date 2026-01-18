import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { wishlistApi } from "./api";
import { useAuth } from "./AuthContext";

type WishlistContextValue = {
  wishlist: string[];
  refreshWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  hasInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  const normalizeProductId = (x: any) => {
    const pid = x?.productId ?? x?.product_id ?? x?.product?.id ?? x?.product?.id ?? null;
    return pid == null ? "" : String(pid);
  };

  const refreshWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      const data = await wishlistApi.getAll();
      const items = Array.isArray(data) ? data : (data as any)?.items ?? [];
      setWishlist(items.map(normalizeProductId).filter(Boolean));
    } catch {
      // If 401 or any error, keep it safe
      setWishlist([]);
    }
  };

  // ✅ auto refresh when auth state changes
  useEffect(() => {
    if (authLoading) return;
    refreshWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      Alert.alert("Login required", "Please login to use wishlist.");
      return;
    }

    const id = String(productId);
    const has = wishlist.includes(id);

    // optimistic UI
    setWishlist((prev) => (has ? prev.filter((x) => x !== id) : [...prev, id]));

    try {
      if (has) await wishlistApi.remove(id);
      else await wishlistApi.add(id);
    } catch {
      // revert if failed
      setWishlist((prev) => (has ? [...prev, id] : prev.filter((x) => x !== id)));
      Alert.alert("Error", "Failed to update wishlist");
    }
  };

  const hasInWishlist = (productId: string) => wishlist.includes(String(productId));

  const value = useMemo(
    () => ({ wishlist, refreshWishlist, toggleWishlist, hasInWishlist }),
    [wishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
