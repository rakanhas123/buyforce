import { api } from "../lib/apiClient";

export type WishlistItem = {
  id: string;
  productId: string;
  productName?: string | null;
  createdAt: string;
};

export async function getWishlist(): Promise<WishlistItem[]> {
  const data = await api<any>("/wishlist");
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export function hasWishlist(productId: string): Promise<{ has: boolean }> {
  return api(`/wishlist/has/${productId}`);
}

export function addWishlist(productId: string): Promise<{ ok: boolean }> {
  return api(`/wishlist/${productId}`, { method: "POST" });
}

export function deleteWishlist(productId: string): Promise<{ ok: boolean }> {
  return api(`/wishlist/${productId}`, { method: "DELETE" });
}
