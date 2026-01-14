import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { productsApi, Product } from "../lib/api";

export default function ProductsScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const catId = categoryId ? parseInt(categoryId) : undefined;
      const data = await productsApi.getAll(catId);
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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/tabs/categories");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>טוען מוצרים...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={26} color="white" />
      </Pressable>

      <Text style={styles.title}>מוצרים</Text>
      <Text style={styles.subtitle}>
        {categoryId ? `קטגוריה #${categoryId}` : "כל המוצרים"}
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        renderItem={({ item }) => {
          const mainImage = item.images?.find(img => img.is_main)?.image_url || 
                           item.images?.[0]?.image_url || 
                           "https://via.placeholder.com/300";
          const price = parseFloat(item.price?.toString() || '0');
          
          return (
            <View style={styles.card}>
              <Pressable
                style={({ pressed }) => [
                  styles.imageContainer,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <Image source={{ uri: mainImage }} style={styles.image} />
                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.price}>₪{price.toFixed(2)}</Text>
                <Text style={styles.stock}>
                  {item.stock_quantity > 0 
                    ? `${item.stock_quantity} במלאי` 
                    : "אזל מהמלאי"}
                </Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.detailsButton,
                  pressed && styles.detailsButtonPressed,
                ]}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <Text style={styles.detailsButtonText}>
                  צפה בפרטים
                </Text>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>אין מוצרים בקטגוריה זו</Text>
          </View>
        }
      />
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
  
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  
  loadingText: {
    color: "#9a9a9a",
    marginTop: 12,
    fontSize: 16,
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

  imageContainer: {
    width: "100%",
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
    color: "#10b981",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  
  stock: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
  },

  detailsButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },

  detailsButtonPressed: {
    backgroundColor: "#1d4ed8",
    transform: [{ scale: 0.98 }],
  },

  detailsButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  
  emptyText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
});
