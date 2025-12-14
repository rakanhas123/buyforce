import axiosClient from "./axiosClient";

export type WishlistItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
};

export const getWishlist = async (token: string): Promise<WishlistItem[]> => {
  const res = await axiosClient.get("/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addToWishlist = async (token: string, productId: number) => {
  await axiosClient.post(
    "/wishlist",
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const removeFromWishlist = async (token: string, productId: number) => {
  await axiosClient.delete(`/wishlist/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
