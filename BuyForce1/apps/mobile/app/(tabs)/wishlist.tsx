import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { productsApi, Product } from "../lib/api";
import { useWishlist } from "../lib/WishlistContext";

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };
  
  const wishlistProducts = products.filter(p =>
    wishlist.includes(p.id)
  );

  const renderItem = ({ item }: { item: Product }) => {
    const mainImage = item.images?.find(img => img.is_main)?.image_url || 
                     item.images?.[0]?.image_url || 
                     "https://via.placeholder.com/300";
    const price = parseFloat(item.price?.toString() || '0');

    return (
      <View style={styles.card}>
        <Pressable onPress={() => router.push(`/product/${item.id}`)}>
          <Image
            source={{ uri: mainImage }}
            style={styles.image}
          />
        </Pressable>

        <View style={styles.cardBody}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>₪{price.toFixed(2)}</Text>
          <Text style={styles.stock}>
            {item.stock_quantity > 0 
              ? `${item.stock_quantity} in stock` 
              : "Out of stock"}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wishlist ❤️</Text>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven't added any products to your wishlist yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlistProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    padding: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9a9a9a",
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  image: {
    width: "100%",
    height: 180,
  },
  cardBody: {
    padding: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  price: {
    color: "#10b981",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 4,
  },
  stock: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
  },
});
