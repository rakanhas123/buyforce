import React, { useEffect, useMemo, useState } from "react";
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
import { productsApi, Product } from "../../lib/api";

export default function ProductsScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const selectedCategoryId = useMemo(() => {
    const raw = categoryId ? String(categoryId) : "";
    return raw.trim();
  }, [categoryId]);

  const filtered = useMemo(() => {
    if (!selectedCategoryId) return products;

    return products.filter((p) => {
      const catId = p.category?.id ?? p.categoryId ?? (p as any).category_id ?? null;
      return catId === selectedCategoryId;
    });
  }, [products, selectedCategoryId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAll();
      setProducts(Array.isArray(data) ? data : (data as any).items ?? []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/tabs/categories");
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Product }) => {
    const mainImage =
      item.imageUrl?.trim() ||
      item.images?.find((x) => x.is_main)?.image_url ||
      item.images?.[0]?.image_url ||
      "https://picsum.photos/seed/buyforce-product/600/600";

    const regular = Number(item.priceRegular ?? 0);
    const open = () => router.push(`/product/${String(item.id)}`);

    return (
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [styles.imageContainer, pressed && styles.cardPressed]}
          onPress={open}
        >
          <Image source={{ uri: mainImage }} style={styles.image} />
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.price}>₪{Number.isFinite(regular) ? regular.toFixed(0) : "0"}</Text>
          <Text style={styles.meta}>{item.category?.name ?? "No category"}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.detailsButton, pressed && styles.detailsButtonPressed]}
          onPress={open}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={26} color="white" />
      </Pressable>

      <Text style={styles.title}>Products</Text>
      <Text style={styles.subtitle}>
        {selectedCategoryId ? "Category Products" : "All Products"}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No products</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0b0b0f" },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#9a9a9a", marginTop: 12, fontSize: 16 },

  backButton: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    padding: 6,
  },

  title: { fontSize: 26, fontWeight: "bold", color: "white", marginTop: 36 },
  subtitle: { color: "#9a9a9a", marginBottom: 16, marginTop: 4, fontSize: 13 },

  list: { paddingBottom: 24 },
  row: { justifyContent: "space-between", marginBottom: 14 },

  card: {
    width: "48%",
    backgroundColor: "#141421",
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#1f1f2e",
  },

  imageContainer: { width: "100%" },
  cardPressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },

  image: { width: "100%", height: 110, borderRadius: 14, marginBottom: 6 },

  cardTitle: { color: "white", fontSize: 15, fontWeight: "600" },
  price: { color: "#10b981", fontSize: 15, fontWeight: "700", marginTop: 2 },
  meta: { color: "#6b7280", fontSize: 12, marginTop: 4 },

  detailsButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  detailsButtonPressed: { backgroundColor: "#1d4ed8", transform: [{ scale: 0.98 }] },
  detailsButtonText: { color: "white", fontSize: 14, fontWeight: "700" },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { color: "#aaa", fontSize: 16, textAlign: "center" },
});
