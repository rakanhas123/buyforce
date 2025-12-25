import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function ProductsRedirect() {
  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual screen while preserving query params
    router.replace({
      pathname: "/Screens/products",
      params: params as Record<string, string>,
    });
  }, [params, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting to products…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { color: "#aaa" },
});
