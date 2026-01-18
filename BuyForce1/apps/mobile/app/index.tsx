import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../lib/AuthContext";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🔄 Index component render:', { isLoading, isAuthenticated });

  useEffect(() => {
    console.log('🔍 Auth Check useEffect triggered:', { isLoading, isAuthenticated });
    
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('Authenticated - navigating to home');
        setTimeout(() => {
          router.replace("/tabs/home");
        }, 100);
      } else {
        console.log('Not authenticated - navigating to login');
        setTimeout(() => {
          router.replace("/auth/login");
        }, 100);
      }
    } else {
      console.log('Still loading...');
    }
  }, [isLoading, isAuthenticated]);

  // Show loading screen while checking auth
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
