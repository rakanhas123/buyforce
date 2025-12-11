import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getNotifications, markAsRead } from "../../api/notificationsApi";
import type { Notification } from "../../api/notificationsApi";
import NotificationItem from "../../components/notifications/NotificationItem";

export default function NotificationsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      const data = await getNotifications(token);
      setItems(data);
    };

    load();
  }, [token]);

  const handleClick = async (id: number) => {
    if (!token) return;

    await markAsRead(token, id);

    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div>
      <h1>Notifications</h1>

      {items.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onClick={() => handleClick(n.id)}
        />
      ))}
    </div>
  );
}
