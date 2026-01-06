import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState, useEffect } from "react";

import { productsApi, Product } from "../lib/api";
import { useWishlist } from "../lib/WishlistContext";

export default function HomeScreen() {
  const router = useRouter();
  const { wishlist, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
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

  /* 🔍 סינון לפי חיפוש */
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchSearch;
    });
  }, [search, products]);

  const renderItem = ({ item }: { item: Product }) => {
    const mainImage = item.images?.find(img => img.is_main)?.image_url || 
                      item.images?.[0]?.image_url || 
                      "https://via.placeholder.com/300";
    
    const price = parseFloat(item.price?.toString() || '0');

    return (
      <View style={styles.card}>
        {/* ❤️ Wishlist */}
        <Pressable
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(item.id)}
        >
          <Text style={{ fontSize: 20 }}>
            {wishlist.includes(item.id) ? "❤️" : "🤍"}
          </Text>
        </Pressable>

        {/* Image */}
        <Pressable onPress={() => router.push(`/product/${item.id}`)}>
          <Image
            source={{ uri: mainImage }}
            style={styles.image}
          />
        </Pressable>

        <View style={styles.cardBody}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>₪{price.toFixed(2)}</Text>
          
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <Text style={styles.stock}>
            {item.stock > 0 ? `במלאי: ${item.stock}` : "אזל מהמלאי"}
          </Text>

          <Pressable
            style={[styles.joinButton, item.stock === 0 && styles.joinButtonDisabled]}
            onPress={() => router.push(`/product/${item.id}`)}
            disabled={item.stock === 0}
          >
            <Text style={styles.joinText}>
              {item.stock > 0 ? "צפה במוצר" : "אזל מהמלאי"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>טוען מוצרים...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BuyForce</Text>
      <Text style={styles.subHeader}>קנייה קבוצתית חכמה</Text>

      <TextInput
        placeholder="חיפוש מוצר..."
        placeholderTextColor="#9ca3af"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* 🔹 קטגוריות */}
      <View style={styles.tabs}>
        <Pressable onPress={() => setCategory("all")}>
          <Text
            style={[
              styles.tab,
              category === "all" && styles.activeTab,
            ]}
          >
            הכול
          </Text>
        </Pressable>

        <Pressable onPress={() => setCategory("electronics")}>
          <Text
            style={[
              styles.tab,
              category === "electronics" && styles.activeTab,
            ]}
          >
            אלקטרוניקה
          </Text>
        </Pressable>

        <Pressable onPress={() => setCategory("mobile")}>
          <Text
            style={[
              styles.tab,
              category === "mobile" && styles.activeTab,
            ]}
          >
            סלולר
          </Text>
        </Pressable>

        <Pressable onPress={() => setCategory("computer")}>
          <Text
            style={[
              styles.tab,
              category === "computer" && styles.activeTab,
            ]}
          >
            מחשבים
          </Text>
        </Pressable>
      </View>

      {/* Products */}
      <FlatList
        data={filteredProducts}
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
        ListEmptyComponent={
          <Text style={styles.empty}>אין מוצרים להצגה</Text>
        }
      />
    </View>
  );
}

/* 🎨 Styles */
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
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  subHeader: {
    color: "#9ca3af",
    marginBottom: 12,
  },
  search: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  tab: {
    color: "#e5e7eb",
    backgroundColor: "#1f2933",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  wishlistBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
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
    marginBottom: 4,
  },
  price: {
    color: "#22c55e",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  description: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },
  stock: {
    color: "#10b981",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
  },
  joinButton: {
    marginTop: 10,
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    borderRadius: 10,
  },
  joinButtonDisabled: {
    backgroundColor: "#4b5563",
  },
  joinText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "700",
  },
  empty: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 40,
  },
});
