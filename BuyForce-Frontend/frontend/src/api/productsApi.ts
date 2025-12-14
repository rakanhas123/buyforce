import axiosClient from "./axiosClient";

export const getProductById = async (id: string) => {
  const res = await axiosClient.get(`/products/${id}`);
  return res.data;
};
