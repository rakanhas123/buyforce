import {
  View,
  Text,
  FlatList,
  StyleSheet,
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
    title: "🎉 הקנייה הצליחה!",
    message: "המוצר AirPods Pro הגיע ליעד הקבוצתי 🎧",
    date: "היום",
    read: false,
  },
  {
    id: 2,
    title: "🔥 כמעט שם",
    message: "ל-Nike Air Force 1 חסרים רק עוד כמה מצטרפים",
    date: "אתמול",
    read: true,
  },
  {
    id: 3,
    title: "💸 ירידת מחיר",
    message: "מחיר ה-Galaxy Watch ירד!",
    date: "לפני 3 ימים",
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            אין התראות חדשות 🔔
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
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
});
