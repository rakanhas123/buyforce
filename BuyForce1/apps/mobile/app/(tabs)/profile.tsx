import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
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
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notLoggedIn}>Not Logged In</Text>
        <Pressable
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>User ID</Text>
        <Text style={styles.infoValue}>#{user.id}</Text>
      </View>

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
        <Text style={styles.infoTitle}>Join Date</Text>
        <Text style={styles.infoValue}>
          {new Date(user.created_at).toLocaleDateString("en-US")}
        </Text>
      </View>

      {/* Links */}
      <Pressable style={styles.link}>
        <Text style={styles.linkText}>My Orders</Text>
      </Pressable>

      <Pressable style={styles.link}>
        <Text style={styles.linkText}>Wishlist</Text>
      </Pressable>

      <Pressable style={styles.link}>
        <Text style={styles.linkText}>My Groups</Text>
      </Pressable>

      {/* Disconnect Button */}
      <Pressable
        style={styles.disconnectButton}
        onPress={handleLogout}
      >
        <Text style={styles.disconnectText}>Disconnect</Text>
      </Pressable>
    </ScrollView>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
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
  loginButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
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
  disconnectButton: {
    marginTop: 30,
    backgroundColor: "#dc2626",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disconnectText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
