import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { productsApi, groupsApi, Product } from "../../lib/api";

export default function ProductIdScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  // ✅ productId as string
  const productId = useMemo(() => {
    const raw = params?.id;
    if (!raw) return "";
    return Array.isArray(raw) ? String(raw[0]) : String(raw);
  }, [params?.id]);

  const [product, setProduct] = useState<Product | null>(null);
  const [group, setGroup] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load product + optional group
  useEffect(() => {
    if (!productId) return;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const p = await productsApi.getById(productId);
        setProduct(p);

        // ✅ Optional: if you have endpoint for group by product
        try {
          const g = await productsApi.getGroupForProduct(productId);
          setGroup(g);
        } catch {
          setGroup(null);
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  // ✅ Create group (if backend supports it)
  const createGroup = async () => {
    if (!product) return;

    try {
      setCreating(true);
      setError("");

      const minParticipants = 3;
      const endsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

      const created = await groupsApi.create({
        name: `Group for ${product.name}`,
        productId,
        minParticipants,
        endsAt,
      });

      router.push(`/group/${created.id}`);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading…</Text>
      </SafeAreaView>
    );
  }

  // ✅ Error state
  if (error || !product) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.err}>{error || "Product not found"}</Text>

        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ✅ Image (support both structures)
  const mainImage =
    // if you have images array in backend
    (product as any)?.images?.find((img: any) => img.is_main)?.image_url ||
    (product as any)?.images?.[0]?.image_url ||
    // if you have imageUrl
    (product as any)?.imageUrl?.trim() ||
    "https://picsum.photos/seed/buyforce/800/800";

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="white" />
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <Image source={{ uri: mainImage }} style={styles.image} />

        <View style={{ padding: 16 }}>
          <Text style={styles.title}>{product.name}</Text>

          <Text style={styles.muted}>
            {(product as any)?.category?.name ?? "No category"}
          </Text>

          <View style={{ height: 10 }} />

          {/* ✅ Price (support both structures) */}
          <Text style={styles.price}>
            ₪
            {Number(
              (product as any)?.price ??
                (product as any)?.priceRegular ??
                0
            ).toFixed(0)}
          </Text>

          {(product as any)?.priceGroup !== undefined && (
            <Text style={styles.muted}>
              Group: ₪{Number((product as any)?.priceGroup ?? 0).toFixed(0)}
            </Text>
          )}

          {(product as any)?.description ? (
            <Text style={styles.desc}>{(product as any).description}</Text>
          ) : null}

          <View style={{ height: 16 }} />

          {/* ✅ GROUP SECTION */}
          {group?.id ? (
            <Pressable
              style={styles.btn}
              onPress={() => router.push(`/group/${group.id}`)}
            >
              <Text style={styles.btnText}>Open Group</Text>
            </Pressable>
          ) : (
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: "#9ca3af", fontWeight: "700" }}>
                No group exists for this product yet.
              </Text>

              <Pressable
                style={[styles.btn, { opacity: 0.7 }]}
                onPress={createGroup}
                disabled={creating}
              >
                <Text style={styles.btnText}>
                  {creating ? "Creating..." : "Create Group"}
                </Text>
              </Pressable>
            </View>
          )}

          {!!error && <Text style={[styles.err, { marginTop: 12 }]}>{error}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0f" },

  center: { justifyContent: "center", alignItems: "center", padding: 16 },

  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 50,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 10,
    borderRadius: 999,
  },

  image: { width: "100%", height: 320, resizeMode: "cover" },

  title: { color: "#fff", fontSize: 22, fontWeight: "900" },
  muted: { color: "#9ca3af", marginTop: 6 },

  price: { color: "#10b981", fontWeight: "900", fontSize: 18, marginTop: 12 },
  desc: { color: "#d1d5db", marginTop: 10, lineHeight: 22 },

  err: { color: "#f87171", fontWeight: "900", textAlign: "center" },

  btn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  btnText: { color: "#fff", fontWeight: "900" },
});
