import {
  View,
  Text,
  FlatList,
  StyleSheet,
<<<<<<< HEAD
  Pressable,
} from "react-native";
import { useState } from "react";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: " Purchase Successful!",
    message: "AirPods Pro group goal reached 🎧",
    date: "Today",
    read: false,
  },
  {
    id: 2,
    title: "Almost There",
    message: "Nike Air Force 1 needs just a few more members",
    date: "Yesterday",
    read: true,
  },
  {
    id: 3,
    title: " Price Drop",
    message: "Galaxy Watch price dropped!",
    date: "3 days ago",
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(DEMO_NOTIFICATIONS);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <Pressable
      style={[
        styles.card,
        !item.read && styles.unread,
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.row}>
        <Text style={styles.title}>{item.title}</Text>
        {!item.read && <View style={styles.dot} />}
      </View>

      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </Pressable>
  );
=======
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { notificationsApi, NotificationItem } from "../../lib/api";

export default function NotificationsScreen() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await notificationsApi.getAll();
      const arr = Array.isArray(data) ? data : (data as any)?.items ?? [];
      setItems(arr);
    } catch (e) {
      console.error("Failed to load notifications:", e);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("he-IL");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <FlatList
<<<<<<< HEAD
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No new notifications 
          </Text>
        }
=======
        data={items}
        keyExtractor={(i) => String(i.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        renderItem={({ item }) => (
          <Pressable style={[styles.card, !(item as any).is_read && styles.unread]}>
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
              {!(item as any).is_read && <View style={styles.dot} />}
            </View>

            <Text style={styles.message}>{item.body}</Text>

            <Text style={styles.date}>
              {formatDateTime((item as any).createdAt ?? (item as any).created_at ?? null)}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
      />
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    padding: 16,
  },
  header: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 16,
  },
=======
  container: { flex: 1, backgroundColor: "#0b0b0b", padding: 16 },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#9ca3af", marginTop: 12 },
  header: { color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 16 },
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
<<<<<<< HEAD
  unread: {
    borderColor: "#3b82f6",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  message: {
    color: "#cfcfcf",
    marginTop: 6,
    marginBottom: 8,
    fontSize: 13,
  },
  date: {
    color: "#9ca3af",
    fontSize: 11,
    textAlign: "right",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#3b82f6",
  },
  empty: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 40,
  },
=======
  unread: { borderColor: "#3b82f6" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#fff", fontWeight: "700", fontSize: 15 },
  message: { color: "#cfcfcf", marginTop: 6, marginBottom: 8, fontSize: 13 },
  date: { color: "#9ca3af", fontSize: 11, textAlign: "right" },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#3b82f6" },
  empty: { color: "#9ca3af", textAlign: "center", marginTop: 40 },
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
});
