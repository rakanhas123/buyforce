import axiosClient from "./axiosClient";

/* =========================
   Get product by ID
========================= */
export const getProductById = async (id: string) => {
  const res = await axiosClient.get(`/products/${id}`);
  return res.data;
};

/* =========================
   Get products by category
========================= */
export const getProductsByCategory = async (category: string) => {
  const res = await axiosClient.get("/products", {
    params: {
      category,
    },
  });

  return res.data;
};
