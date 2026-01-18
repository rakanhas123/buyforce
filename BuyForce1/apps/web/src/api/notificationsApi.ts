import { api } from "../lib/apiClient";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

export function getNotifications(): Promise<{ items: NotificationItem[] }> {
  return api("/notifications");
}

export function markRead(id: string) {
  return api(`/notifications/${id}/read`, { method: "POST" });
}
