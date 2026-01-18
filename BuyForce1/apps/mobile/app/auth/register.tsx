// apps/mobile/app/auth/register.tsx
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/tabs/home");
  }, [isAuthenticated, isLoading, router]);

  const submit = async () => {
    if (!fullName || !email || !password) return Alert.alert("Error", "All fields are required");
    if (password !== confirm) return Alert.alert("Error", "Passwords do not match");

    try {
      setSubmitting(true);
      await register(fullName, email, password);
    } catch (e: any) {
      Alert.alert("Registration failed", e?.response?.data?.error ?? e?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput placeholder="Full Name" style={styles.input} value={fullName} onChangeText={setFullName} />
        <TextInput placeholder="Email" style={styles.input} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry value={confirm} onChangeText={setConfirm} />

        <TouchableOpacity style={[styles.button, submitting && { opacity: 0.6 }]} disabled={submitting} onPress={submit}>
          <Text style={styles.buttonText}>{submitting ? "Creating..." : "Register"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.bold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", backgroundColor: "#fff" },
  form: { padding: 24, maxWidth: 420, width: "100%", alignSelf: "center" },
  title: { fontSize: 26, fontWeight: "900", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 12 },
  button: { backgroundColor: "#000", paddingVertical: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "700" },
  link: { textAlign: "center", marginTop: 16, color: "#4b5563" },
  bold: { fontWeight: "700", textDecorationLine: "underline" },
});
