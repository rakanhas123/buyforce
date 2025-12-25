
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetch("http://localhost:3000/notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.log("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/notifications/${id}/read`, {
        method: "PATCH",
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.log("Failed to mark as read");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a5acd" />
      </View>
    );
  }

  if (!notifications.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>אין התראות כרגע 🔕</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              item.read ? styles.read : styles.unread,
            ]}
            onPress={() => markAsRead(item.id)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleString()}
            </Text>

            {!item.read && <Text style={styles.new}>● חדש</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* ===========================
   Styles
=========================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b0b0b",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  unread: {
    backgroundColor: "#1a1a1a",
  },
  read: {
    backgroundColor: "#111",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#fff",
  },
  message: {
    fontSize: 14,
    marginBottom: 6,
    color: "#ccc",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  new: {
    marginTop: 6,
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  empty: {
    fontSize: 16,
    color: "#777",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
