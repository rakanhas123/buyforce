import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-navigate when authentication succeeds
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('✅ Registration successful, navigating to home...');
      router.replace("/tabs/home");
    }
  }, [isAuthenticated, isLoading]);

  const handleSubmit = async () => {
    console.log('📝 Form data:', { name, email, phone, password, confirmPassword });
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!name || !email || !password) {
      console.log('❌ Validation failed:', { name, email, password });
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Calling register with:', { name, email, phone, password });
      await register(name, email, phone, password);
      Alert.alert("Success", "Account created successfully!");
      // Don't manually navigate - index.tsx will handle routing based on auth state
    } catch (err: any) {
      console.error('❌ Register error:', err);
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Registration failed";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create your account 🚀</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              console.log('✍️ Name changed:', text);
              setName(text);
            }}
            placeholder="Your name"
            autoCapitalize="words"
          />
        </View>

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
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone (Optional)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={(text) => {
              console.log('✍️ Phone changed:', text);
              setPhone(text);
            }}
            placeholder="052-1234567"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              console.log('✍️ Password changed:', text);
              setPassword(text);
            }}
            placeholder="••••••••"
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => {
              console.log('✍️ Confirm Password changed:', text);
              setConfirmPassword(text);
            }}
            placeholder="••••••••"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => {
            console.log('🔘 Register button pressed!');
            handleSubmit();
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating account..." : "Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
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
