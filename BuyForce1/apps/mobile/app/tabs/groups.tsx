import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { groupsApi, Group } from "../../lib/api";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
export default function GroupsScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
useFocusEffect(
  useCallback(() => {
    loadGroups();
  }, [])
);

const loadGroups = async () => {
  try {
    setLoading(true);

    const data = await groupsApi.getAll();

    // ✅ supports both: array OR { items: [...] }
    const items = Array.isArray(data) ? data : (data as any)?.items ?? [];

    setGroups(items);
  } catch (error) {
    console.error("Failed to load groups:", error);
    setGroups([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  const onRefresh = () => {
    setRefreshing(true);
    loadGroups();
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/tabs/home");
  };

  const statusLabel = (s?: string) => {
    switch (s) {
      case "OPEN":
        return "Open";
      case "LOCKED":
        return "Locked";
      case "CHARGED":
        return "Charged";
      case "FAILED":
        return "Failed";
      case "COMPLETED":
        return "Completed";
      default:
        return s ?? "—";
    }
  };

  const statusColor = (s?: string) => {
    switch (s) {
      case "OPEN":
        return "#10b981"; // green
      case "LOCKED":
        return "#f59e0b"; // amber
      case "CHARGED":
      case "COMPLETED":
        return "#3b82f6"; // blue
      case "FAILED":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </Pressable>
        <Text style={styles.title}>Groups</Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        renderItem={({ item }) => {
          const joined = Number(item.joinedCount ?? 0);
          const min = Number(item.minParticipants ?? 0);

          // createdAt can be returned as createdAt or created_at depending on backend
          const createdIso =
            (item as any).createdAt ??
            (item as any).created_at ??
            null;

          return (
            <Pressable style={styles.card} onPress={() => router.push(`/group/${item.id}`)}>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) }]}>
                <Text style={styles.statusText}>{statusLabel(item.status)}</Text>
              </View>

              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.members}>
                Members: {joined}/{min || "—"}
              </Text>

              <Text style={styles.date}>Created: {formatDate(createdIso)}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No groups to display</Text>
          </View>
        }
      />
    </View>
  );
}

/* ================= Styles ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b0b0f",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9a9a9a",
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    padding: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  card: {
    flex: 1,
    backgroundColor: "#141421",
    borderRadius: 16,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#1f1f2e",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  cardTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  members: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600",
  },
  date: {
    color: "#6b7280",
    fontSize: 12,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    color: "#9a9a9a",
    fontSize: 16,
  },
});
