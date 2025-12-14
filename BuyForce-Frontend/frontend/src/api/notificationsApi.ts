import  axiosClient  from "./axiosClient";

export type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
};

export const getNotifications = async (token: string): Promise<Notification[]> => {
  const res = await axiosClient.get("/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markAsRead = async (token: string, id: number) => {
  await axiosClient.post(
    `/notifications/${id}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
