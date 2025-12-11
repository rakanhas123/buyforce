import { axiosClient } from "./axiosClient";

export const getUserProfile = async (token: string) => {
  const res = await axiosClient.get("/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUserProfile = async (token: string, data: any) => {
  const res = await axiosClient.put("/users/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
