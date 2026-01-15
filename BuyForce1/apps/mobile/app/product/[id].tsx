import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { productsApi, Product } from "../lib/api";

export default function ProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const productId = Number(id);
      
      if (isNaN(productId)) {
        setError("Invalid product ID");
        return;
      }

      const data = await productsApi.getById(productId);
      setProduct(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error loading product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{error || "Product not found"}</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const mainImage = product.images?.find((img) => img.is_main)?.image_url || 
                     product.images?.[0]?.image_url ||
                     "https://via.placeholder.com/400";

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
        />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <Image
          source={{ uri: mainImage }}
          style={styles.image}
        />

        {/* Product Info */}
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>
          ₪{parseFloat(product.price?.toString() || '0').toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>

        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}

        {/* Category & Stock */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{product.category?.name || "No category"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Stock</Text>
            <Text style={[
              styles.infoValue,
              product.stock_quantity > 0 ? styles.inStock : styles.outOfStock
            ]}>
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
            </Text>
          </View>
        </View>

        {/* Specs */}
        {product.specs && product.specs.length > 0 && (
          <View style={styles.specsSection}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {product.specs.map((spec, index) => (
              <View key={index} style={styles.specItem}>
                <Text style={styles.specKey}>{spec.spec_key}</Text>
                <Text style={styles.specValue}>{spec.spec_value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Additional Images */}
        {product.images && product.images.length > 1 && (
          <View style={styles.imagesSection}>
            <Text style={styles.sectionTitle}>More Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {product.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.image_url }}
                  style={styles.thumbnailImage}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Join Button */}
      <Pressable
        style={[
          styles.joinButton,
          product.stock_quantity === 0 && styles.joinButtonDisabled
        ]}
        disabled={product.stock_quantity === 0}
        onPress={() => router.push("/tabs/groups")}
      >
        <Text style={styles.joinText}>
          {product.stock_quantity > 0 ? "Join Group" : "Out of stock"}
        </Text>
      </Pressable>

    </SafeAreaView>
  );
}

/* =========================
    Styles
   ========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0f",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 16,
  },
  error: {
    color: "#f87171",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 0,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "#10b981",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 15,
    color: "#d1d5db",
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 16,
  },
  infoItem: {
    flex: 1,
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  inStock: {
    color: "#10b981",
  },
  outOfStock: {
    color: "#f87171",
  },
  specsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  specItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  specKey: {
    fontSize: 14,
    color: "#9ca3af",
  },
  specValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  imagesSection: {
    paddingHorizontal: 16,
    marginBottom: 80,
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  joinButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  joinButtonDisabled: {
    backgroundColor: "#374151",
  },
  joinText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
