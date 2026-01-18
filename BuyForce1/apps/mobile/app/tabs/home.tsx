import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
  RefreshControl,
  ImageStyle,
} from "react-native";
import { useRouter } from "expo-router";

import { categoriesApi, productsApi, groupsApi, Product, Group } from "../../lib/api";
import { useWishlist } from "../../lib/WishlistContext";

type CategoryChip = { id: string; label: string };

function mapGroupsByProduct(groups: Group[]): Record<string, Group> {
  const map: Record<string, Group> = {};
  for (const g of groups) {
    const pid = String((g as any).productId ?? (g as any).product_id ?? "");
    if (!pid) continue;
    if (!map[pid]) map[pid] = g;
  }
  return map;
}

export default function HomeScreen() {
  const router = useRouter();
  const { wishlist, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [groupsByProduct, setGroupsByProduct] = useState<Record<string, Group>>({});
  const [categories, setCategories] = useState<CategoryChip[]>([{ id: "all", label: "All Products" }]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [groupDetail, setGroupDetail] = useState<Group | null>(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [modalBusy, setModalBusy] = useState(false);

  const loadAll = async () => {
    const [cats, prods, groups] = await Promise.all([
      categoriesApi.getAll().catch(() => []),
      productsApi.getAll(),
      groupsApi.getAll().catch(() => []),
    ]);

    setProducts(prods);

    const chips: CategoryChip[] = [
      { id: "all", label: "All Products" },
      ...cats.map((c: any) => ({ id: String(c.id), label: c.name })),
    ];
    setCategories(chips);

    setGroupsByProduct(mapGroupsByProduct(groups));
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadAll();
      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "Failed to load home data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadAll();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      const nameOk = !s || String(p.name).toLowerCase().includes(s);
      if (selectedCategoryId === "all") return nameOk;

      const pCatId = String(p.category?.id ?? p.categoryId ?? "");
      return nameOk && pCatId === String(selectedCategoryId);
    });
  }, [products, search, selectedCategoryId]);

  const getMainImage = (p: Product) =>
    p.imageUrl?.trim() ||
    p.images?.find((x) => x.is_main)?.image_url ||
    p.images?.[0]?.image_url ||
    "https://picsum.photos/seed/buyforce/600/600";

  const refreshGroupDetail = async (productId: string) => {
    const g = groupsByProduct[String(productId)];
    if (!g?.id) {
      setGroupDetail(null);
      return;
    }
    try {
      const detail = await groupsApi.getById(String(g.id));
      setGroupDetail(detail);
    } catch {
      setGroupDetail(null);
    }
  };

  const openGroupModal = async (productId: string) => {
    setSelectedProductId(productId);
    setGroupModalOpen(true);
    setGroupDetail(null);
    await refreshGroupDetail(productId);
  };

  // ✅ MAIN FIX: after join/leave, fetch fresh group and update card counts
  const toggleJoinLeave = async (productId: string, inModal: boolean) => {
    const pid = String(productId);
    const g = groupsByProduct[pid];

    if (!g?.id) {
      Alert.alert("No group", "This product doesn't have a group yet.");
      return;
    }

    const groupId = String(g.id);

    try {
      if (inModal) setModalBusy(true);
      else setBusyProductId(pid);
const before = await groupsApi.getById(groupId);
const joined = Boolean(before.isJoined);

if (joined) await groupsApi.leave(groupId);
else await groupsApi.join(groupId);

const after = await groupsApi.getById(groupId);

setGroupDetail(after);

      setGroupsByProduct((prev) => ({
        ...prev,
        [pid]: {
          ...(prev[pid] as any),
          joinedCount: Number((after as any).joinedCount ?? 0),
          minParticipants: Number((after as any).minParticipants ?? 0),
          progress: Number((after as any).progress ?? 0),
          status: (after as any).status ?? (prev[pid] as any).status,
          id: groupId,
          productId: (prev[pid] as any).productId ?? pid,
        },
      }));
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to join/leave");
    } finally {
      if (inModal) setModalBusy(false);
      else setBusyProductId(null);
    }
  };

  const ProductCard = ({ item }: { item: Product }) => {
    const pid = String(item.id);
    const group = groupsByProduct[pid];

    const mainImage = getMainImage(item);
    const regular = Number((item as any).priceRegular ?? (item as any).price ?? 0);
    const groupPrice = Number((item as any).priceGroup ?? 0);

    const joinedCount = Number((group as any)?.joinedCount ?? 0);
    const min = Number((group as any)?.minParticipants ?? 0);
    const status = String((group as any)?.status ?? "—");

    const busy = busyProductId === pid;

    // ✅ JOIN/LEAVE label comes from freshest detail if it matches this group
    const joined = Boolean(groupDetail?.id === group?.id ? (groupDetail as any)?.isJoined : false);

    const isInWishlist = wishlist.includes(pid);

    return (
      <View style={styles.card}>
        <Pressable onPress={() => router.push(`/product/${pid}`)}>
          <View style={styles.imageWrap}>
            <Image source={{ uri: mainImage }} style={styles.image} />
          </View>
        </Pressable>

        <View style={styles.cardBody}>
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>{item.category?.name ?? "No category"}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₪{Number.isFinite(regular) ? regular.toFixed(0) : "0"}</Text>
            {groupPrice > 0 && <Text style={styles.groupPrice}>₪{groupPrice.toFixed(0)}</Text>}
          </View>

          <View style={styles.groupBox}>
            <Text style={styles.groupText} numberOfLines={1}>
              {group?.id ? `${status} (${joinedCount}/${min || "—"})` : "No group"}
            </Text>

            <Pressable
              style={[styles.joinLeaveBtn, (busy || !group?.id) && { opacity: 0.6 }]}
              disabled={busy || !group?.id}
              onPress={() => toggleJoinLeave(pid, false)}
            >
              <Text style={styles.joinLeaveText}>
                {busy ? "..." : joined ? "LEAVE" : "JOIN"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.openBtn, !group?.id && { opacity: 0.5 }]}
              onPress={() => {
                if (!group?.id) {
                  Alert.alert("No group", "No group exists for this product yet.");
                  return;
                }
                openGroupModal(pid);
              }}
            >
              <Text style={styles.openBtnText}>GROUP</Text>
            </Pressable>

            <Pressable style={styles.heartBtn} onPress={() => toggleWishlist(pid)} hitSlop={10}>
              <Text style={styles.heart}>{isInWishlist ? "❤️" : "🤍"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const selectedProduct = selectedProductId ? products.find((p) => String(p.id) === selectedProductId) : null;
  const selectedGroup = selectedProductId ? groupsByProduct[String(selectedProductId)] : null;

  const modalJoinedCount = Number((groupDetail as any)?.joinedCount ?? (selectedGroup as any)?.joinedCount ?? 0);
  const modalMin = Number((groupDetail as any)?.minParticipants ?? (selectedGroup as any)?.minParticipants ?? 0);
  const modalStatus = String((groupDetail as any)?.status ?? (selectedGroup as any)?.status ?? "—");
  const modalIsJoined = Boolean((groupDetail as any)?.isJoined);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🛍️ BuyForce</Text>
          <Text style={styles.tagline}>Smart Group Shopping</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.chip, selectedCategoryId === c.id && styles.chipActive]}
              onPress={() => setSelectedCategoryId(c.id)}
            >
              <Text style={[styles.chipText, selectedCategoryId === c.id && styles.chipTextActive]}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>✨ Popular Products</Text>

        <View style={styles.grid}>
          {filteredProducts.map((p) => (
            <View key={String(p.id)} style={styles.gridItem}>
              <ProductCard item={p} />
            </View>
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={groupModalOpen} transparent animationType="slide" onRequestClose={() => setGroupModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.modalTitle}>Group</Text>
              <Pressable onPress={() => setGroupModalOpen(false)}>
                <Text style={{ fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalProduct}>{selectedProduct?.name ?? "—"}</Text>

            {!selectedGroup?.id ? (
              <Text style={{ color: "#64748b", marginTop: 10 }}>
                No group exists for this product yet.
              </Text>
            ) : (
              <>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Status</Text>
                  <Text style={styles.modalInfoValue}>{modalStatus}</Text>
                </View>

                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Members</Text>
                  <Text style={styles.modalInfoValue}>
                    {modalJoinedCount}/{modalMin || "—"}
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.modalActionBtn,
                    modalIsJoined && styles.modalLeaveBtn,
                    modalBusy && { opacity: 0.6 },
                  ]}
                  disabled={modalBusy}
                  onPress={() => selectedProductId && toggleJoinLeave(selectedProductId, true)}
                >
                  <Text style={styles.modalActionText}>
                    {modalBusy ? "Please wait..." : modalIsJoined ? "LEAVE" : "JOIN"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#64748b" },

  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
  logo: { fontSize: 26, fontWeight: "900", color: "#0f172a" },
  tagline: { color: "#64748b", marginTop: 2 },

  searchContainer: { paddingHorizontal: 16, marginBottom: 10 },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#0f172a",
  },

  chipsRow: { paddingHorizontal: 12, gap: 8, paddingBottom: 10 },
  chip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#334155", fontWeight: "800", fontSize: 12 },
  chipTextActive: { color: "#fff" },

  sectionTitle: { paddingHorizontal: 16, marginTop: 8, marginBottom: 10, fontSize: 16, fontWeight: "900", color: "#0f172a" },

  grid: { paddingHorizontal: 12, flexDirection: "row", flexWrap: "wrap" },
  gridItem: { width: "50%", paddingHorizontal: 6, paddingBottom: 12 },

  card: { backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#e2e8f0" },

  imageWrap: {
    width: "100%",
    height: 90,
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "85%", height: "85%", resizeMode: "contain" } as ImageStyle,

  cardBody: { padding: 8, gap: 5 },
  title: { fontSize: 13, fontWeight: "900", color: "#0f172a" },
  meta: { color: "#64748b", fontSize: 11 },

  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { color: "#059669", fontWeight: "900", fontSize: 13 },
  groupPrice: { color: "#0f172a", fontWeight: "800", fontSize: 11 },

  groupBox: { backgroundColor: "#dbeafe", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 8, gap: 6 },
  groupText: { color: "#1e40af", fontWeight: "900", fontSize: 11 },

  joinLeaveBtn: { backgroundColor: "#0f172a", borderRadius: 10, paddingVertical: 7, alignItems: "center" },
  joinLeaveText: { color: "#fff", fontWeight: "900", fontSize: 11 },

  actionsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  openBtn: { backgroundColor: "#2563eb", paddingVertical: 9, paddingHorizontal: 12, borderRadius: 12 },
  openBtnText: { color: "#fff", fontWeight: "900", fontSize: 12 },
  heartBtn: { padding: 6 },
  heart: { fontSize: 18 },

  empty: { padding: 40, alignItems: "center" },
  emptyText: { color: "#64748b" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 18, borderTopRightRadius: 18, gap: 10 },

  modalTitle: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  modalProduct: { fontSize: 14, fontWeight: "800", color: "#334155" },

  // ✅ FIXED: no typo in justifyContent
  modalInfoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalInfoLabel: { color: "#64748b", fontWeight: "700" },
  modalInfoValue: { color: "#0f172a", fontWeight: "900" },

  modalActionBtn: { backgroundColor: "#2563eb", borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 6 },
  modalLeaveBtn: { backgroundColor: "#ef4444" },
  modalActionText: { color: "#fff", fontWeight: "900" },
});
