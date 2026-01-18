import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
<<<<<<< HEAD
import { useEffect } from "react";
import { useAuth } from "./lib/AuthContext";
=======
import { useEffect, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

<<<<<<< HEAD
  console.log('🔄 Index component render:', { isLoading, isAuthenticated });

  useEffect(() => {
    console.log('🔍 Auth Check useEffect triggered:', { isLoading, isAuthenticated });
    
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('✅ Authenticated - navigating to home');
        setTimeout(() => {
          router.replace("/tabs/home");
        }, 100);
      } else {
        console.log('❌ Not authenticated - navigating to login');
        setTimeout(() => {
          router.replace("/auth/login");
        }, 100);
      }
    } else {
      console.log('⏳ Still loading...');
    }
  }, [isLoading, isAuthenticated]);

  // Show loading screen while checking auth
=======
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

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
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
