import type { Notification } from "../../api/notificationsApi";

type Props = {
  notification: Notification;
  onClick: () => void;
};

export default function NotificationItem({ notification, onClick }: Props) {
  return (
    <div
      className={`notification-item ${notification.read ? "read" : "unread"}`}
      onClick={onClick}
    >
      <h3>{notification.title}</h3>
      <p>{notification.message}</p>
      <small>{new Date(notification.createdAt).toLocaleString()}</small>
    </div>
  );
}
