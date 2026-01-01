import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/* ===== טיפוס ===== */
type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  categoryId: string;
};

/* ===== דאטה (דמו – תואם ל־product/[id].tsx) ===== */
const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "AirPods Pro",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1588156979435-1d26a06f5b26?auto=format&fit=crop&w=800&q=80",
    categoryId: "electronics",
  },
  {
    id: "p2",
    title: "Running Shoes",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    categoryId: "fashion",
  },
  {
    id: "p6",
    title: "MacBook Pro M3",
    price: 8001,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    categoryId: "electronics",
  },
  {
    id: "p3",
    title: "Samsung Galaxy Watch",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    categoryId: "electronics",
  },
  {
    id: "p4",
    title: "MacBook Pro M3",
    price: 8001,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    categoryId: "electronics",
  },
  {
    id: "p5",
    title: "Gaming Pro Laptop",
    price: 5499,
    image:
      "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=80",
    categoryId: "electronics",
  },
];

/* ===== Screen ===== */
export default function ProductsScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();

  const filteredProducts = PRODUCTS.filter(
    (p) => p.categoryId === categoryId
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ⬅️ חץ חזרה */}
      <Pressable
        style={styles.backButton}
        onPress={handleBack}
      >
        <Ionicons
          name="arrow-back"
          size={26}
          color="white"
        />
      </Pressable>

      <Text style={styles.title}>Products</Text>
      <Text style={styles.subtitle}>
        Category: {categoryId}
      </Text>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.price}>₪{item.price}</Text>
          </Pressable>
        )}
      />

      {filteredProducts.length === 0 && (
        <Text style={styles.empty}>
          No products in this category
        </Text>
      )}
    </SafeAreaView>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b0b0f",
  },

  backButton: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    padding: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    color: "#9a9a9a",
    marginBottom: 16,
    marginTop: 4,
    fontSize: 13,
  },

  list: {
    gap: 14,
  },

  row: {
    gap: 14,
  },

  card: {
    flex: 1,
    backgroundColor: "#141421",
    borderRadius: 18,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#1f1f2e",
  },

  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  image: {
    width: "100%",
    height: 110,
    borderRadius: 14,
    marginBottom: 6,
  },

  cardTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  price: {
    color: "#aaa",
    fontSize: 13,
  },

  empty: {
    color: "#aaa",
    marginTop: 40,
    textAlign: "center",
  },
});
