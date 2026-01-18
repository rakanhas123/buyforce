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
import { useEffect, useMemo, useState } from "react";
import { productsApi, Product } from "../../lib/api";
import { useWishlist } from "../../lib/WishlistContext";
import { useAuth } from "../../lib/AuthContext";

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlist, refreshWishlist, toggleWishlist } = useWishlist();
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const data = await productsApi.getAll();
    const items = Array.isArray(data) ? data : (data as any)?.items ?? [];
    setProducts(items);

    // wishlist requires auth
    await refreshWishlist();
  };

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        setLoading(true);
        await load();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const wishlistProducts = useMemo(() => {
    const set = new Set(wishlist.map(String));
    return products.filter((p) => set.has(String(p.id)));
  }, [products, wishlist]);

  const renderItem = ({ item }: { item: Product }) => {
    const id = String(item.id);

    const mainImage =
      item.imageUrl?.trim() ||
      item.images?.find((x: any) => x.is_main)?.image_url ||
      item.images?.[0]?.image_url ||
      "https://picsum.photos/seed/buyforce-wishlist/600/600";

    const regular = Number((item as any).priceRegular ?? (item as any).price ?? 0);

    return (
      <View style={styles.card}>
        <Pressable onPress={() => router.push(`/product/${id}`)}>
          <Image source={{ uri: mainImage }} style={styles.image} />
        </Pressable>

        <View style={styles.cardBody}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.price}>
            ₪{Number.isFinite(regular) ? regular.toFixed(0) : "0"}
          </Text>

          <Pressable style={styles.removeBtn} onPress={() => toggleWishlist(id)}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
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

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Login to use Wishlist</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wishlist</Text>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No wishlist items yet</Text>
        </View>
      ) : (
        <FlatList
          data={wishlistProducts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b", padding: 16 },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#9a9a9a", marginTop: 12, fontSize: 16 },

  header: { color: "#fff", fontSize: 24, fontWeight: "800", marginBottom: 16 },

  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  image: { width: "100%", height: 180 },
  cardBody: { padding: 12, gap: 8 },
  title: { color: "#fff", fontSize: 16, fontWeight: "800" },
  price: { color: "#10b981", fontWeight: "900", fontSize: 16 },

  removeBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#1a0f0f",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  removeText: { color: "#f87171", fontWeight: "900" },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#9ca3af", textAlign: "center" },
});
