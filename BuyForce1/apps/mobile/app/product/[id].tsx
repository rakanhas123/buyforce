import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

/* ===== טיפוס ===== */
type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  members: number;
  goal: number;
};

/* ===== דאטה (אותו ID כמו במסך products) ===== */
const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "AirPods Pro",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1588156979435-1d26a06f5b26",
    members: 62,
    goal: 100,
  },
  {
    id: "p2",
    title: "Nike Air Force",
    price: 449,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    members: 91,
    goal: 100,
  },
];

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Product not found</Text>
      </View>
    );
  }

  const progress = Math.round(
    (product.members / product.goal) * 100
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>₪{product.price}</Text>

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progress}%` }]}
        />
      </View>

      <Text style={styles.meta}>
        {product.members}/{product.goal} members ({progress}%)
      </Text>

      {progress >= 80 && (
        <Text style={styles.badge}>🔥 Almost there</Text>
      )}

      <Pressable style={styles.joinButton}>
        <Text style={styles.joinText}>Join Group</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b0b0f",
  },

  image: {
    width: "100%",
    height: 260,
    borderRadius: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 6,
  },

  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "#cfcfcf",
    marginBottom: 18,
  },

  progressBar: {
    height: 10,
    backgroundColor: "#1f1f2e",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 6,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#ffffffcc",
  },

  meta: {
    color: "#9a9a9a",
    fontSize: 13,
    marginBottom: 10,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#2b2b15",
    color: "#ffd700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: "bold",
    marginBottom: 24,
    fontSize: 13,
  },

  joinButton: {
    marginTop: "auto",
    backgroundColor: "#ffffff22",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff33",
  },

  joinText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
