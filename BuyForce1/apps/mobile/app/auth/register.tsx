<<<<<<< HEAD
import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../lib/AuthContext";
=======
// apps/mobile/app/auth/register.tsx
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/AuthContext";
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

<<<<<<< HEAD
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
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>

<<<<<<< HEAD
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
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
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
