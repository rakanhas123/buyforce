<<<<<<< HEAD
=======
import React, { useEffect, useMemo, useState } from "react";
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
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
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { productsApi, Product } from "../lib/api";

export default function ProductsScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();
=======
import { productsApi, Product } from "../../lib/api";

export default function ProductsScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

<<<<<<< HEAD
  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const catId = categoryId ? parseInt(categoryId) : undefined;
      const data = await productsApi.getAll(catId);
      setProducts(data);
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

<<<<<<< HEAD
=======
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleBack = () => {
<<<<<<< HEAD
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/tabs/categories");
    }
=======
    if (router.canGoBack()) router.back();
    else router.replace("/tabs/categories");
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </SafeAreaView>
    );
  }

<<<<<<< HEAD
=======
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

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={26} color="white" />
      </Pressable>

      <Text style={styles.title}>Products</Text>
      <Text style={styles.subtitle}>
<<<<<<< HEAD
        {categoryId ? `Category #${categoryId}` : "All Products"}
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
=======
        {selectedCategoryId ? "Category Products" : "All Products"}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
<<<<<<< HEAD
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
                    ? `${item.stock_quantity} in stock` 
                    : "Out of stock"}
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
                  View Details
                </Text>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No products in this category</Text>
=======
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No products</Text>
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
          </View>
        }
      />
    </SafeAreaView>
  );
}

<<<<<<< HEAD
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
=======
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0b0b0f" },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#9a9a9a", marginTop: 12, fontSize: 16 },
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

  backButton: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    padding: 6,
  },

<<<<<<< HEAD
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
=======
  title: { fontSize: 26, fontWeight: "bold", color: "white", marginTop: 36 },
  subtitle: { color: "#9a9a9a", marginBottom: 16, marginTop: 4, fontSize: 13 },

  list: { paddingBottom: 24 },
  row: { justifyContent: "space-between", marginBottom: 14 },

  card: {
    width: "48%",
    backgroundColor: "#141421",
    borderRadius: 18,
    padding: 10,
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    borderWidth: 1,
    borderColor: "#1f1f2e",
  },

<<<<<<< HEAD
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
=======
  imageContainer: { width: "100%" },
  cardPressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },

  image: { width: "100%", height: 110, borderRadius: 14, marginBottom: 6 },

  cardTitle: { color: "white", fontSize: 15, fontWeight: "600" },
  price: { color: "#10b981", fontSize: 15, fontWeight: "700", marginTop: 2 },
  meta: { color: "#6b7280", fontSize: 12, marginTop: 4 },
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

  detailsButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
<<<<<<< HEAD
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
=======
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  detailsButtonPressed: { backgroundColor: "#1d4ed8", transform: [{ scale: 0.98 }] },
  detailsButtonText: { color: "white", fontSize: 14, fontWeight: "700" },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { color: "#aaa", fontSize: 16, textAlign: "center" },
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
});
