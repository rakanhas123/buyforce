import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PaymentCancel() {
  const { groupId } = useLocalSearchParams<{ groupId?: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.big}>❌ Payment Cancelled</Text>
      <Text style={styles.small}>Group: {groupId ?? "—"}</Text>

      <Pressable style={styles.btn} onPress={() => router.replace("/tabs/home")}>
        <Text style={styles.btnText}>Back to Home</Text>
      </Pressable>

      {!!groupId && (
        <Pressable style={[styles.btn, styles.secondary]} onPress={() => router.replace(`/group/${groupId}`)}>
          <Text style={[styles.btnText, { color: "#111" }]}>Back to Group</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", alignItems: "center", justifyContent: "center", padding: 20, gap: 10 },
  big: { fontSize: 22, fontWeight: "900", color: "#0f172a" },
  small: { color: "#64748b" },
  btn: { backgroundColor: "#2563eb", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, width: "100%", maxWidth: 340, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "900" },
  secondary: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e2e8f0" },
});
