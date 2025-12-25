
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

type WishlistItem = {
  product_id: number;
  name: string;
  price: number;
  image_url?: string;
};

export default function WishlistScreen() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await fetch("http://localhost:3000/wishlist");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.log("Failed to load wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      await fetch(`http://localhost:3000/wishlist/${productId}`, {
        method: "DELETE",
      });

      setItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    } catch (err) {
      console.log("Failed to remove from wishlist");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a5acd" />
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>הווישליסט שלך ריק 💔</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💜 My Wishlist</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product_id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image_url && (
              <Image
                source={{ uri: item.image_url }}
                style={styles.image}
              />
            )}

            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price} ₪</Text>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromWishlist(item.product_id)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

/* ===========================
   Styles
=========================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b0b0b",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
  },
  price: {
    fontSize: 14,
    marginVertical: 6,
    color: "#3b82f6",
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#ff5c5c",
  },
  removeText: {
    color: "white",
    fontWeight: "600",
  },
  empty: {
    fontSize: 16,
    color: "#777",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
