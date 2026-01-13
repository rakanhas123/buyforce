import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { groupsApi, Group } from "../lib/api";

export default function GroupsScreen() {
  const { categoryId, productId } = useLocalSearchParams<{
    categoryId?: string;
    productId?: string;
  }>();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGroups(true);
  }, []);

  const loadGroups = async (isInitialLoad = false) => {
    try {
      // רק בטעינה ראשונית תראה loading מלא
      if (isInitialLoad) {
        setLoading(true);
      }
      
      const data = await groupsApi.getAll();
      setGroups(data);
    } catch (error) {
      console.error("Failed to load groups:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadGroups(false); // לא תראה loading מלא, רק את ה-spinner למעלה
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>טוען קבוצות...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </Pressable>
        <Text style={styles.title}>קבוצות</Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        renderItem={({ item }) => {
          const statusColors = {
            active: "#10b981",
            pending: "#f59e0b",
            completed: "#3b82f6",
            cancelled: "#ef4444",
          };
          const statusColor = statusColors[item.status as keyof typeof statusColors] || "#6b7280";

          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/group/${item.id}`)}
            >
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>
                  {item.status === "active"
                    ? "פעילה"
                    : item.status === "pending"
                    ? "ממתינה"
                    : item.status === "completed"
                    ? "הושלמה"
                    : "בוטלה"}
                </Text>
              </View>

              <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
              
              <Text style={styles.date}>
                נוצרה: {new Date(item.created_at).toLocaleDateString('he-IL')}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>אין קבוצות להצגה</Text>
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
