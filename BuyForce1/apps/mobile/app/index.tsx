import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useAuth } from "../lib/AuthContext";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const didRedirect = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (didRedirect.current) return;

    didRedirect.current = true;

    if (isAuthenticated) {
      router.replace("/tabs/home");
    } else {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
  },
});
