// apps/mobile/app/auth/register.tsx
import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('Registration successful, navigating to home...');
      router.replace("/tabs/home");
    }
  }, [isAuthenticated, isLoading]);

  const handleSubmit = async () => {
    console.log(' Form data:', { fullName, email, phone, password, confirm });
    
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!fullName || !email || !password) {
      console.log(' Validation failed:', { fullName, email, password });
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      console.log(' Calling register with:', { fullName, email, phone, password });
      await register(fullName, email, password);
      Alert.alert("Success", "Account created successfully!");
    } catch (err: any) {
      console.error(' Register error:', err);
      const errorMessage = err?.message || "Registration failed. Please try again.";
      
      // Provide user-friendly messages for common errors
      if (errorMessage.includes('Email already in use')) {
        Alert.alert(
          "Email Already Registered", 
          "This email is already registered. Please use a different email or try logging in.",
          [
            { text: "Try Again", style: "default" },
            { text: "Go to Login", onPress: () => router.push("/auth/login") }
          ]
        );
      } else {
        Alert.alert("Registration Failed", errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
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
            onChangeText={setPhone}
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
              console.log('Password changed:', text.length, 'chars');
              setPassword(text);
            }}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="off"
            textContentType="newPassword"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={(text) => {
              console.log('🔑 Confirm changed:', text.length, 'chars');
              setConfirm(text);
            }}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="off"
            textContentType="newPassword"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Creating account..." : "Register"}
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
  container: { flexGrow: 1, justifyContent: "center", backgroundColor: "#fff" },
  form: { padding: 24, maxWidth: 420, width: "100%", alignSelf: "center" },
  title: { fontSize: 26, fontWeight: "900", marginBottom: 24, textAlign: "center" },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#374151" },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 14, fontSize: 16 },
  button: { backgroundColor: "#000", paddingVertical: 14, borderRadius: 8, marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "700" },
  linkText: { textAlign: "center", marginTop: 16, color: "#4b5563" },
  linkBold: { fontWeight: "700", textDecorationLine: "underline" },
});
