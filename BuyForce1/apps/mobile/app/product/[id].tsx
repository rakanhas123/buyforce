import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

/* ===== Type ===== */
type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  members: number;
  goal: number;
  specs?: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    screen?: string;
  };
};

/* ===== Data ===== */
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
    title: "Gaming Laptop",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    members: 18,
    goal: 50,
    specs: {
      cpu: "Intel Core i7 13th Gen",
      gpu: "NVIDIA RTX 4060",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      screen: '15.6" FHD 144Hz',
    },
  },
];

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

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
      {/* Image */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Title & Price */}
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>₪{product.price}</Text>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Pressable
          style={styles.joinButtonSmall}
          onPress={() => alert("Joined for $1")}
        >
          <Text style={styles.joinButtonText}>Join $1</Text>
        </Pressable>

        <Pressable
          style={styles.viewButton}
          onPress={() => router.back()}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </Pressable>
      </View>

      {/* Meta info */}
      <View style={styles.metaRow}>
        <Text style={styles.metaItem}>👥 {product.members} joined</Text>
        <Text style={styles.metaItem}>⏳ 2 days left</Text>
        <Text style={styles.metaItem}>⭐ 4.8</Text>
      </View>

      {/* Specifications (Gaming Laptop only) */}
      {product.specs && (
        <View style={styles.specsBox}>
          <Text style={styles.specsTitle}>Specifications</Text>

          {product.specs.cpu && (
            <Text style={styles.specItem}>🧠 CPU: {product.specs.cpu}</Text>
          )}
          {product.specs.gpu && (
            <Text style={styles.specItem}>🎮 GPU: {product.specs.gpu}</Text>
          )}
          {product.specs.ram && (
            <Text style={styles.specItem}>💾 RAM: {product.specs.ram}</Text>
          )}
          {product.specs.storage && (
            <Text style={styles.specItem}>📦 Storage: {product.specs.storage}</Text>
          )}
          {product.specs.screen && (
            <Text style={styles.specItem}>🖥️ Screen: {product.specs.screen}</Text>
          )}
        </View>
      )}

      {/* Progress */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%` },
          ]}
        />
      </View>

      <Text style={styles.meta}>
        {product.members}/{product.goal} members ({progress}%)
      </Text>

      {progress >= 80 && (
        <Text style={styles.badge}>🔥 Almost there</Text>
      )}

      {/* Bottom CTA */}
      <Pressable style={styles.joinButton}>
        <Text style={styles.joinText}>Join Group</Text>
      </Pressable>
    </View>
  );
}

/* ===== Styles ===== */
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
    marginBottom: 12,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },

  joinButtonSmall: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
  },

  joinButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },

  viewButton: {
    flex: 1,
    backgroundColor: "#ffffff22",
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff44",
  },

  viewButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  metaItem: {
    color: "#9a9a9a",
    fontSize: 13,
  },

  specsBox: {
    backgroundColor: "#141421",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1f1f2e",
  },

  specsTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  specItem: {
    color: "#cfcfcf",
    fontSize: 13,
    marginBottom: 4,
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
