import { useEffect, useState } from "react";
import { SafeAreaView, Text, Pressable, ScrollView, ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { groupsApi, Group } from "../../lib/api";

export default function MyGroupsScreen() {
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ THIS is the correct endpoint: GET /v1/groups/my
        const res = await groupsApi.getMy();
        setGroups(res);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load my groups");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0b0f", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ color: "#9ca3af", marginTop: 10 }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0b0f", padding: 16 }}>
      <Pressable
        onPress={() => router.back()}
        style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#1f2933", alignSelf: "flex-start" }}
      >
        <Text style={{ color: "#e5e7eb", fontWeight: "900" }}>← Back</Text>
      </Pressable>

      <Text style={{ color: "#fff", fontWeight: "900", fontSize: 22, marginTop: 14 }}>My Groups</Text>

      {error ? <Text style={{ color: "#f87171", marginTop: 10, fontWeight: "900" }}>{error}</Text> : null}

      <ScrollView style={{ marginTop: 14 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {groups.length === 0 ? (
          <View style={{ backgroundColor: "#111827", borderRadius: 16, padding: 16 }}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>No joined groups yet</Text>
            <Text style={{ color: "#9ca3af", marginTop: 8 }}>Join a group first from the Groups tab.</Text>
            <Pressable
              onPress={() => router.push("/groups")}
              style={{ marginTop: 12, backgroundColor: "#3b82f6", paddingVertical: 12, borderRadius: 12, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>Open Groups</Text>
            </Pressable>
          </View>
        ) : (
          groups.map((g) => (
            <Pressable
              key={g.id}
              onPress={() => router.push(`/groups/${g.id}`)}
              style={{ backgroundColor: "#111827", borderRadius: 16, padding: 16, marginBottom: 12 }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>{g.name}</Text>
              <Text style={{ color: "#9ca3af", marginTop: 6 }}>
                {Number(g.joinedCount ?? 0)}/{Number(g.minParticipants ?? 0)} • {g.status}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
