<<<<<<< HEAD
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
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

  const [g, setG] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
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
        setError("Invalid group ID");
        return;
      }

      const data = await groupsApi.getById(groupId);
      setGroup(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error loading group");
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading group...</Text>
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
      </SafeAreaView>
    );
  }

<<<<<<< HEAD
  if (error || !group) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{error || "Group not found"}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
=======
  if (!g) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.err}>Group not found</Text>
        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Back</Text>
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
        </Pressable>
      </SafeAreaView>
    );
  }

<<<<<<< HEAD
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
          <Text style={styles.headerTitle}>Group Details</Text>
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
                  ? "Active"
                  : group.status === "pending"
                  ? "Pending"
                  : group.status === "completed"
                  ? "Completed"
                  : "Cancelled"}
              </Text>
            </View>
          </View>

          {group.description && (
            <Text style={styles.description}>{group.description}</Text>
          )}

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressText}>
                {group.current_members}/{group.goal_members} members
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
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>
                {new Date(group.start_date).toLocaleDateString("en-US")}
              </Text>
            </View>
            {group.end_date && (
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateValue}>
                  {new Date(group.end_date).toLocaleDateString("en-US")}
                </Text>
              </View>
            )}
          </View>

          {/* Price */}
          {group.price && (
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Price per Member</Text>
              <Text style={styles.priceValue}>₪{group.price}</Text>
            </View>
          )}
        </View>

        {/* Join Button */}
        {group.status === "active" && group.current_members < group.goal_members && (
          <Pressable style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Group</Text>
          </Pressable>
        )}
      </ScrollView>
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
});
