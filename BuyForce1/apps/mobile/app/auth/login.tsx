import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-navigate when authentication succeeds
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('✅ Login successful, navigating to home...');
      router.replace("/tabs/home");
    }
  }, [isAuthenticated, isLoading]);

  const handleSubmit = async () => {
    console.log('📝 Login form data:', { email, password: '***' });
    
    if (!email || !password) {
      console.log('❌ Validation failed:', { email, password });
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      console.log(' Calling login with:', { email });
      await login(email, password);
      Alert.alert("Success", "Logged in successfully!");
      // Don't manually navigate - index.tsx will handle routing based on auth state
    } catch (err: any) {
      console.error('❌ Login error:', err);
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Login failed";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}> Welcome back! </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              console.log('✍️ Email changed:', text);
              setEmail(text);
            }}
            placeholder="you@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              console.log('✍️ Password changed');
              setPassword(text);
            }}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => {
            console.log(' Login button pressed!');
            handleSubmit();
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  formContainer: {
    padding: 24,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    textAlign: "center",
    fontSize: 14,
    color: "#4b5563",
  },
  linkBold: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
