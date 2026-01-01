import http from "./http";

export type WishlistItem = {
  id: string;
  name: string;
  url?: string | null;
  created_at: string;
};

export async function getWishlist(): Promise<WishlistItem[]> {
  const { data } = await http.get("/v1/wishlist");
  return data.items;
}

export async function addWishlist(name: string, url?: string) {
  const { data } = await http.post("/v1/wishlist", { name, url });
  return data.item as WishlistItem;
}

export async function deleteWishlist(id: string) {
  const { data } = await http.delete(`/v1/wishlist/${id}`);
  return data;
}
