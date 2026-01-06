import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { groupsApi, Group } from "../lib/api";

export default function GroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGroup();
  }, [id]);

  const loadGroup = async () => {
    try {
      setLoading(true);
      setError("");
      const groupId = Number(id);

      if (isNaN(groupId)) {
        setError("מזהה קבוצה לא תקין");
        return;
      }

      const data = await groupsApi.getById(groupId);
      setGroup(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "שגיאה בטעינת הקבוצה");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>טוען קבוצה...</Text>
      </SafeAreaView>
    );
  }

  if (error || !group) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{error || "קבוצה לא נמצאה"}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>חזור</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const statusColors = {
    active: "#10b981",
    pending: "#f59e0b",
    completed: "#3b82f6",
    cancelled: "#ef4444",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>פרטי קבוצה</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Group Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.groupName}>{group.name}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors[group.status] || "#6b7280" },
              ]}
            >
              <Text style={styles.statusText}>
                {group.status === "active"
                  ? "פעילה"
                  : group.status === "pending"
                  ? "ממתינה"
                  : group.status === "completed"
                  ? "הושלמה"
                  : "בוטלה"}
              </Text>
            </View>
          </View>

          {group.description && (
            <Text style={styles.description}>{group.description}</Text>
          )}

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>התקדמות</Text>
              <Text style={styles.progressText}>
                {group.current_members}/{group.goal_members} חברים
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (group.current_members / group.goal_members) * 100,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Dates */}
          <View style={styles.datesSection}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>תאריך התחלה</Text>
              <Text style={styles.dateValue}>
                {new Date(group.start_date).toLocaleDateString("he-IL")}
              </Text>
            </View>
            {group.end_date && (
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>תאריך סיום</Text>
                <Text style={styles.dateValue}>
                  {new Date(group.end_date).toLocaleDateString("he-IL")}
                </Text>
              </View>
            )}
          </View>

          {/* Price */}
          {group.price && (
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>מחיר לחבר</Text>
              <Text style={styles.priceValue}>₪{group.price}</Text>
            </View>
          )}
        </View>

        {/* Join Button */}
        {group.status === "active" && group.current_members < group.goal_members && (
          <Pressable style={styles.joinButton}>
            <Text style={styles.joinButtonText}>הצטרף לקבוצה</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 16,
  },
  error: {
    color: "#f87171",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#1f2937",
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  groupName: {
    flex: 1,
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#9ca3af",
    fontSize: 14,
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#374151",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  datesSection: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  dateValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  priceSection: {
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    color: "#9ca3af",
    fontSize: 14,
  },
  priceValue: {
    color: "#10b981",
    fontSize: 20,
    fontWeight: "700",
  },
  joinButton: {
    backgroundColor: "#3b82f6",
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
