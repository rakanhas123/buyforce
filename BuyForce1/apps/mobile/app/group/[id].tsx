import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { groupsApi, Group } from "../../lib/api";

export default function GroupIdScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  const groupId = useMemo(() => {
    const raw = params?.id;
    if (!raw) return "";
    return Array.isArray(raw) ? String(raw[0]) : String(raw);
  }, [params?.id]);

  const [g, setG] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadGroup = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      setError("");

      const data = await groupsApi.getById(groupId);
      setG(data);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load group";
      setError(msg);
      setG(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const onJoinLeave = async () => {
    if (!g?.id) return;

    try {
      setBusy(true);
      setError("");

      if ((g as any).isJoined) {
        await groupsApi.leave(g.id);
      } else {
        await groupsApi.join(g.id);
      }

      const fresh = await groupsApi.getById(g.id);
      setG(fresh);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed";
      Alert.alert("Error", msg);
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading group…</Text>
      </SafeAreaView>
    );
  }

  if (error || !g) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.err}>{error || "Group not found"}</Text>

        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  //  Support different backend fields
  const currentMembers =
    Number((g as any).current_members ?? (g as any).joinedCount ?? 0);

  const goalMembers =
    Number((g as any).goal_members ?? (g as any).minParticipants ?? 0);

  const progressPercent =
    goalMembers > 0 ? Math.min((currentMembers / goalMembers) * 100, 100) : 0;

  //  Status color
  const statusColors: Record<string, string> = {
    active: "#10b981",
    pending: "#f59e0b",
    completed: "#3b82f6",
    cancelled: "#ef4444",
  };

  const statusColor = statusColors[(g as any).status] || "#6b7280";

  return (
    <SafeAreaView style={styles.container}>
      {/*  Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Group Details</Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/*  Group Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.groupName}>{g.name}</Text>

            <View style={[styles.badge, { backgroundColor: statusColor }]}>
              <Text style={styles.badgeText}>{String((g as any).status).toUpperCase()}</Text>
            </View>
          </View>

          {(g as any).description ? (
            <Text style={styles.description}>{(g as any).description}</Text>
          ) : null}

          {/*  Progress */}
          <View style={{ marginTop: 14 }}>
            <View style={styles.progressInfo}>
              <Text style={styles.muted}>Progress</Text>
              <Text style={styles.progressText}>
                {currentMembers}/{goalMembers || "—"} members
              </Text>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/*  Join/Leave */}
          <Pressable
            style={[styles.btn, busy && { opacity: 0.6 }]}
            disabled={busy}
            onPress={onJoinLeave}
          >
            <Text style={styles.btnText}>
              {busy ? "..." : (g as any).isJoined ? "Leave Group" : "Join Group"}
            </Text>
          </Pressable>

          {/*  Refresh */}
          <Pressable style={[styles.btn, styles.secondary]} onPress={loadGroup}>
            <Text style={[styles.btnText, { color: "#111" }]}>Refresh</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0f" },

  center: { justifyContent: "center", alignItems: "center", padding: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },

  card: {
    backgroundColor: "#141421",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#1f1f2e",
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  groupName: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  description: {
    color: "#d1d5db",
    marginTop: 12,
    lineHeight: 22,
  },

  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: { color: "#fff", fontWeight: "800" },

  progressBar: {
    height: 8,
    backgroundColor: "#374151",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },

  muted: { color: "#9ca3af", marginTop: 8 },

  err: { color: "#f87171", fontWeight: "900", textAlign: "center" },

  btn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
  },
  btnText: { color: "#fff", fontWeight: "900" },

  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});
