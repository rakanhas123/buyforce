import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-navigate when authentication succeeds
  useEffect(() => {
    console.log('🔄 Login screen - auth state:', { isAuthenticated, isLoading });
    if (!isLoading && isAuthenticated) {
      console.log('✅ Already authenticated, navigating to home...');
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, isLoading]);

  const handleLogin = async () => {
    console.log('🚀 handleLogin called');
    // ❌ בדיקה – אם אחד ריק
    if (!email || !password) {
      console.log('❌ Missing email or password');
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    console.log('✅ Validation passed, starting login...');
    // ✅ יש מייל וסיסמה
    setLoading(true);

    try {
      console.log('📞 Calling login()...');
      await login(email, password);
      console.log('✅ Login completed successfully!');
      // Don't manually navigate - index.tsx will handle routing based on auth state
    } catch (error: any) {
      console.error('❌ Login error caught:', error);
      Alert.alert("Login Failed", error?.response?.data?.message || "Invalid credentials");
    } finally {
      console.log('🏁 Login process finished, setLoading(false)');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back 👋</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Login"}
        </Text>
      </Pressable>

      {/* Link to Register */}
      <Pressable
        style={styles.linkContainer}
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.linkText}>
          Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  linkBold: {
    color: "#000",
    fontWeight: "700",
  },
});
