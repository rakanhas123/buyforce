<<<<<<< HEAD
=======
import React, { useMemo } from "react";
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
import {
  View,
  Text,
  StyleSheet,
<<<<<<< HEAD
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/AuthContext";
=======
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
<<<<<<< HEAD
  const [edit, setEdit] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.full_name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
=======

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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  }, [user]);

  const handleLogout = async () => {
    await logout();
<<<<<<< HEAD
=======
    // route should match your files: app/auth/login.tsx
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    router.replace("/auth/login");
  };

  if (isLoading) {
    return (
<<<<<<< HEAD
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
=======
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    );
  }

  if (!user) {
    return (
<<<<<<< HEAD
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notLoggedIn}>Not logged in</Text>
        <Pressable
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </View>
=======
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.notLoggedIn}>Not logged in</Text>
        <Pressable
          style={styles.loginButton}
          onPress={() => router.replace("/auth/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </SafeAreaView>
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    );
  }

  return (
<<<<<<< HEAD
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        {edit && (
          <Pressable onPress={() => setEdit(false)}>
            <Text style={styles.edit}>Save</Text>
          </Pressable>
        )}
      </View>

      {/* User Info */}
=======
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>User ID</Text>
        <Text style={styles.infoValue}>#{user.id}</Text>
      </View>

<<<<<<< HEAD
      {/* Fields */}
      <Field
        label="Full Name"
        value={name}
        setValue={setName}
        edit={edit}
      />

      <Field
        label="Email"
        value={email}
        setValue={setEmail}
        edit={false} // Email can't be edited
      />

      <Field
        label="Phone"
        value={phone}
        setValue={setPhone}
        edit={edit}
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Registration Date</Text>
        <Text style={styles.infoValue}>
          {new Date(user.created_at).toLocaleDateString("he-IL")}
        </Text>
      </View>

      {/* Links */}
      <Pressable style={styles.link}>
        <Text style={styles.linkText}>My Orders</Text>
      </Pressable>

      <Pressable style={styles.link}>
        <Text style={styles.linkText}>My Wishlist</Text>
      </Pressable>

      <Pressable style={styles.link}>
        <Text style={styles.linkText}>My Groups</Text>
      </Pressable>

      {/* Logout */}
      <Pressable
        style={styles.logout}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

/* 🔹 Field Component */
function Field({
  label,
  value,
  setValue,
  edit,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  edit: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {edit ? (
        <TextInput
          value={value}
          onChangeText={setValue}
          style={styles.input}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    padding: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 16,
  },
  notLoggedIn: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
=======
  container: { flex: 1, backgroundColor: "#0b0b0b", padding: 20 },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#9ca3af", marginTop: 12, fontSize: 16 },

  notLoggedIn: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 20 },
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  loginButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
<<<<<<< HEAD
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  edit: {
    color: "#3b82f6",
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoTitle: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#141414",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  link: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
  },
=======
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  title: { color: "#fff", fontSize: 24, fontWeight: "900", marginBottom: 16 },

  infoCard: { backgroundColor: "#1f2937", padding: 16, borderRadius: 12, marginBottom: 12 },
  infoTitle: { color: "#9ca3af", fontSize: 12, marginBottom: 4 },
  infoValue: { color: "#fff", fontSize: 16, fontWeight: "800" },

  link: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#1f1f1f" },
  linkText: { color: "#fff", fontSize: 16, fontWeight: "700" },

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  logout: {
    marginTop: 30,
    backgroundColor: "#1a0f0f",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
<<<<<<< HEAD
  logoutText: {
    color: "#f87171",
    fontWeight: "700",
  },
=======
  logoutText: { color: "#f87171", fontWeight: "900" },
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
});
