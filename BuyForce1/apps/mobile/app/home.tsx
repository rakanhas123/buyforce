import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
<<<<<<< HEAD:BuyForce1/apps/mobile/app/home.tsx
import { useEffect, useMemo, useState } from "react";

/* ========= Types ========= */

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  currentMembers: number;
  goalMembers: number;
};

/* ========= Demo Data ========= */

const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Apple AirPods Pro",
    price: 899,
    imageUrl:
      "https://images.unsplash.com/photo-1588156979435-1d26a06f5b26?auto=format&fit=crop&w=800&q=60",
    currentMembers: 62,
    goalMembers: 100,
  },
  {
    id: 2,
    name: "Nike Air Force 1",
    price: 449,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60",
    currentMembers: 91,
    goalMembers: 100,
  },
];

/* ========= API (optional & typed) ========= */

type ApiClient = {
  get: (url: string) => Promise<{ data: unknown[] }>;
};

let api: ApiClient | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  api = require("../../src/config/api").default as ApiClient;
} catch {
  api = null;
}

/* ========= Component ========= */
=======
>>>>>>> ac947e26b9ab2b39954631bbe7be05b34a1b266b:BuyForce1/apps/mobile/app/index.tsx

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BuyForce</Text>
      <Text style={styles.subtitle}>
        Group buying made simple
      </Text>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/categories")}
      >
        <Text style={styles.cardTitle}>Browse Categories</Text>
        <Text style={styles.cardSubtitle}>
          Start a group & save together
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 30,
  },
  card: {
    width: "100%",
    backgroundColor: "#141421",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#aaa",
    marginTop: 6,
    fontSize: 13,
  },
});
