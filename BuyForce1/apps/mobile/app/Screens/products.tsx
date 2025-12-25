import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

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
      "https://images.unsplash.com/photo-1588156979435-1d26a06f5b26",
    categoryId: "electronics",
  },
  {
    id: "p2",
    title: "Gaming Laptop",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    categoryId: "electronics",
  },
  {
    id: "p3",
    title: "Running Shoes",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    categoryId: "fashion",
  },
  {
    id: "p4",
    title: "Luxury Perfume",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f",
    categoryId: "beauty",
  },
];

/* ===== Screen ===== */
export default function ProductsScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();

  const filteredProducts = PRODUCTS.filter(
    (p) => p.categoryId === categoryId
  );

  return (
    <View style={styles.container}>
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
