import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { groupsApi, paymentsApi, Group } from "../../lib/api";

export default function PaymentScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();

  const gid = useMemo(() => String(groupId || ""), [groupId]);

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [g, setG] = useState<Group | null>(null);

  const load = async () => {
    if (!gid) return;
    try {
      setLoading(true);
      const data = await groupsApi.getById(gid); // includes isJoined + canPay
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
  }, [gid]);

  const status = String(g?.status ?? "—");
  const joinedCount = Number(g?.joinedCount ?? 0);
  const min = Number(g?.minParticipants ?? 0);

  const isJoined = Boolean(g?.isJoined);
  const canPay = Boolean(g?.canPay);

  const onPay = async () => {
    if (!gid) return;

    if (!canPay) {
      return Alert.alert("Not ready", "You can pay only when the group is LOCKED and you joined.");
    }

    try {
      setPaying(true);

      const { url } = await paymentsApi.checkout(gid, "mobile");
      if (!url) throw new Error("Missing checkout url from server");

      await WebBrowser.openBrowserAsync(url);

      // refresh after returning
      await load();
    } catch (e: any) {
      Alert.alert("Payment error", e?.message ?? "Failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading…</Text>
      </View>
    );
  }

  if (!g) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#0f172a", fontWeight: "800" }}>Group not found</Text>
        <Pressable style={[styles.btn, styles.secondary]} onPress={() => router.back()}>
          <Text style={[styles.btnText, { color: "#111" }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>

      <View style={styles.card}>
        <Text style={styles.row}>
          Status: <Text style={styles.bold}>{status}</Text>
        </Text>

        <Text style={styles.row}>
          Members:{" "}
          <Text style={styles.bold}>
            {joinedCount}/{min || "—"}
          </Text>
        </Text>

        <Text style={styles.row}>
          Joined: <Text style={styles.bold}>{isJoined ? "YES" : "NO"}</Text>
        </Text>

        <Text style={styles.row}>
          Can Pay: <Text style={styles.bold}>{canPay ? "YES" : "NO"}</Text>
        </Text>

        <Pressable style={[styles.btn, (!canPay || paying) && { opacity: 0.6 }]} disabled={!canPay || paying} onPress={onPay}>
          <Text style={styles.btnText}>{paying ? "Opening Stripe…" : "Pay with Stripe"}</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.secondary]} onPress={load}>
          <Text style={[styles.btnText, { color: "#111" }]}>Refresh Status</Text>
        </Pressable>

        <Pressable style={{ marginTop: 10 }} onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>After payment, return here and press “Refresh Status”.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "900", color: "#0f172a", marginBottom: 12 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#e2e8f0" },
  row: { color: "#334155", marginBottom: 6 },
  bold: { fontWeight: "900", color: "#0f172a" },
  btn: { backgroundColor: "#2563eb", borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "900" },
  secondary: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e2e8f0" },
  backLink: { textAlign: "center", color: "#2563eb", fontWeight: "800" },
  hint: { marginTop: 12, color: "#64748b", fontSize: 12 },
});
