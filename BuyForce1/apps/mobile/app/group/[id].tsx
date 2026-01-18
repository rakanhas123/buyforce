import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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

  const load = async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const data = await groupsApi.getById(groupId);
      setG(data);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to load group");
      setG(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const onJoinLeave = async () => {
    if (!g?.id) return;
    try {
      setBusy(true);
      if (g.isJoined) await groupsApi.leave(g.id);
      else await groupsApi.join(g.id);

      const fresh = await groupsApi.getById(g.id);
      setG(fresh);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading…</Text>
      </SafeAreaView>
    );
  }

  if (!g) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.err}>Group not found</Text>
        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const joined = Number((g as any).joinedCount ?? 0);
  const min = Number((g as any).minParticipants ?? 0);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{g.name}</Text>

      <View style={styles.card}>
        <Text style={styles.row}>Status: <Text style={styles.bold}>{g.status}</Text></Text>
        <Text style={styles.row}>Members: <Text style={styles.bold}>{joined}/{min || "—"}</Text></Text>
        <Text style={styles.row}>Joined: <Text style={styles.bold}>{g.isJoined ? "YES" : "NO"}</Text></Text>

        <Pressable style={[styles.btn, busy && { opacity: 0.6 }]} disabled={busy} onPress={onJoinLeave}>
          <Text style={styles.btnText}>{busy ? "..." : g.isJoined ? "LEAVE" : "JOIN"}</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.secondary]} onPress={load}>
          <Text style={[styles.btnText, { color: "#111" }]}>Refresh</Text>
        </Pressable>

        <Pressable style={{ marginTop: 10 }} onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0b0b0f" },
  center: { justifyContent: "center", alignItems: "center" },

  title: { color: "#fff", fontSize: 22, fontWeight: "900", marginBottom: 12 },
  card: { backgroundColor: "#141421", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#1f1f2e" },

  row: { color: "#cbd5e1", marginBottom: 8 },
  bold: { color: "#fff", fontWeight: "900" },
  muted: { color: "#9ca3af", marginTop: 10 },
  err: { color: "#f87171", fontWeight: "900" },

  btn: { backgroundColor: "#2563eb", borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "900" },
  secondary: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e2e8f0" },

  backLink: { textAlign: "center", color: "#93c5fd", fontWeight: "800" },
});
