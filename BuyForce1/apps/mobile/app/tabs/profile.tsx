import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const fullName = useMemo(() => {
    const u: any = user;
    return (u?.fullName ?? u?.full_name ?? "").trim();
  }, [user]);

  const createdLabel = useMemo(() => {
    const u: any = user;
    const created = u?.createdAt ?? u?.created_at ?? null;
    if (!created) return "—";
    const d = new Date(created);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("he-IL");
  }, [user]);

  const handleLogout = async () => {
    await logout();
    // route should match your files: app/auth/login.tsx
    router.replace("/auth/login");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.notLoggedIn}>Not logged in</Text>
        <Pressable
          style={styles.loginButton}
          onPress={() => router.replace("/auth/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>User ID</Text>
        <Text style={styles.infoValue}>#{user.id}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Full Name</Text>
        <Text style={styles.infoValue}>{fullName || "—"}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Email</Text>
        <Text style={styles.infoValue}>{user.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Registration Date</Text>
        <Text style={styles.infoValue}>{createdLabel}</Text>
      </View>

      <Pressable style={styles.link} onPress={() => router.push("/tabs/wishlist")}>
        <Text style={styles.linkText}>My Wishlist</Text>
      </Pressable>

      <Pressable style={styles.link} onPress={() => router.push("/tabs/groups")}>
        <Text style={styles.linkText}>My Groups</Text>
      </Pressable>

      <Pressable
        style={styles.link}
        onPress={() => router.push("/tabs/notifications")}
      >
        <Text style={styles.linkText}>Notifications</Text>
      </Pressable>

      <Pressable style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b", padding: 20 },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#9ca3af", marginTop: 12, fontSize: 16 },

  notLoggedIn: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 20 },
  loginButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  title: { color: "#fff", fontSize: 24, fontWeight: "900", marginBottom: 16 },

  infoCard: { backgroundColor: "#1f2937", padding: 16, borderRadius: 12, marginBottom: 12 },
  infoTitle: { color: "#9ca3af", fontSize: 12, marginBottom: 4 },
  infoValue: { color: "#fff", fontSize: 16, fontWeight: "800" },

  link: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" },
  linkText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  logout: {
    marginTop: 30,
    backgroundColor: "#1a0f0f",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "#f87171", fontWeight: "900" },
});
