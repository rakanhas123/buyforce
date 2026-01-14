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
  Animated,
  Dimensions,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";

import { productsApi, Product } from "../lib/api";
import { useWishlist } from "../lib/WishlistContext";

const CATEGORIES = [
  { id: "all", label: "All Products", icon: "📦" },
  { id: "electronics", label: "Electronics", icon: "⚡" },
  { id: "mobile", label: "Mobile", icon: "📱" },
  { id: "computer", label: "Computers", icon: "💻" },
];

const BANNERS = [
  {
    id: 1,
    title: "Smart Group Shopping",
    subtitle: "Up to 50% off on selected items",
    color: "#3b82f6",
    icon: "🎉",
  },
  {
    id: 2,
    title: "Free Shipping",
    subtitle: "On every order over $100",
    color: "#10b981",
    icon: "🚚",
  },
  {
    id: 3,
    title: "14-Day Returns",
    subtitle: "Easy and hassle-free returns",
    color: "#f59e0b",
    icon: "↩️",
  },
];

const { width } = Dimensions.get("window");

// Group Types
interface Group {
  id: string;
  targetQuantity: number;
  currentParticipants: number;
  pricePerUnit: number;
  joined: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const { wishlist, toggleWishlist } = useWishlist();
  const scrollViewRef = useRef<ScrollView>(null);
  const bannerScrollX = useRef(new Animated.Value(0)).current;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  // Groups state - store groups per product
  const [productGroups, setProductGroups] = useState<{[key: number]: Group[]}>({});
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");

  useEffect(() => {
    loadProducts();
    const bannerTimer = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(bannerTimer);
  }, []);

  const loadProducts = async () => {
    try {
      console.log('📦 Loading products from API...');
      const data = await productsApi.getAll();
      console.log('✅ Products loaded:', data.length, 'products');
      setProducts(data);
      
      // Initialize groups for each product
      const groupsMap: {[key: number]: Group[]} = {};
      data.forEach(product => {
        groupsMap[product.id] = [
          {
            id: `${product.id}-1`,
            targetQuantity: 5,
            currentParticipants: Math.floor(Math.random() * 4) + 1,
            pricePerUnit: parseFloat(product.price?.toString() || '0'),
            joined: false,
          },
          {
            id: `${product.id}-2`,
            targetQuantity: 10,
            currentParticipants: Math.floor(Math.random() * 8) + 2,
            pricePerUnit: parseFloat(product.price?.toString() || '0') * 0.95,
            joined: false,
          },
          {
            id: `${product.id}-3`,
            targetQuantity: 20,
            currentParticipants: Math.floor(Math.random() * 15) + 3,
            pricePerUnit: parseFloat(product.price?.toString() || '0') * 0.90,
            joined: false,
          },
        ];
      });
      setProductGroups(groupsMap);
    } catch (error) {
      console.error("❌ Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = (productId: number, groupId: string) => {
    const group = productGroups[productId]?.find(g => g.id === groupId);
    if (group && group.currentParticipants < group.targetQuantity) {
      setSelectedGroup(group);
      setShowGroupModal(false);
      setShowPaymentModal(true);
    }
  };

  const processPayment = async () => {
    if (!selectedGroup || !selectedProductId) return;

    setPaymentLoading(true);
    try {
      // Step 1: Request Payment Intent from backend
      const API_BASE = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.160.126:3000';
      const paymentIntentResponse = await fetch(`${API_BASE}/api/payments/group-join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProductId,
          groupId: selectedGroup.id,
          amount: selectedGroup.pricePerUnit,
          paymentMethod: paymentMethod,
        }),
      });

      const intentData = await paymentIntentResponse.json();

      if (!intentData.success) {
        Alert.alert("❌ Payment Error", intentData.message || "Failed to initialize payment");
        return;
      }

      // Step 2: For demo purposes - confirm payment directly
      // In production, this would involve actual Stripe checkout or PayPal flow
      const confirmResponse = await fetch(`${API_BASE}/api/payments/confirm-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: intentData.paymentIntentId,
          productId: selectedProductId,
          groupId: selectedGroup.id,
          userId: "guest-user",
        }),
      });

      const confirmData = await confirmResponse.json();

      if (confirmData.success) {
        // Update group participants
        setProductGroups(prev => ({
          ...prev,
          [selectedProductId]: prev[selectedProductId].map(group =>
            group.id === selectedGroup.id
              ? { ...group, currentParticipants: group.currentParticipants + 1, joined: true }
              : group
          ),
        }));

        setShowPaymentModal(false);
        Alert.alert(
          "✅ Payment Successful!",
          `You've successfully joined the group!\n\nAmount paid: $${selectedGroup.pricePerUnit.toFixed(2)}\nTransaction ID: ${confirmData.transactionId}\n\nPayment Method: ${paymentMethod === 'paypal' ? 'PayPal' : 'Card'}`,
          [{ text: "OK", onPress: () => setSelectedGroup(null) }]
        );
      } else {
        Alert.alert("❌ Payment Failed", confirmData.message || "Please try again");
      }
    } catch (error) {
      Alert.alert("❌ Error", "Failed to process payment. Please check your connection.");
      console.error("Payment error:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const renderBannerIndicators = () => (
    <View style={styles.bannerIndicators}>
      {BANNERS.map((_, index) => (
        <Pressable
          key={index}
          style={[
            styles.indicator,
            currentBannerIndex === index && styles.activeIndicator,
          ]}
          onPress={() => setCurrentBannerIndex(index)}
        />
      ))}
    </View>
  );

  const renderGroupModal = () => {
    if (!selectedProductId) return null;
    const groups = productGroups[selectedProductId] || [];
    const product = products.find(p => p.id === selectedProductId);

    return (
      <Modal
        visible={showGroupModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGroupModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Join a Group Buying</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowGroupModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.productTitle}>{product?.name}</Text>

            <View style={styles.groupsList}>
              {groups.map(group => {
                const progress = (group.currentParticipants / group.targetQuantity) * 100;
                const remaining = group.targetQuantity - group.currentParticipants;

                return (
                  <View key={group.id} style={styles.groupCard}>
                    <View style={styles.groupHeader}>
                      <View>
                        <Text style={styles.groupTarget}>Group: {group.targetQuantity} units</Text>
                        <Text style={styles.groupParticipants}>
                          👥 {group.currentParticipants}/{group.targetQuantity} participants
                        </Text>
                      </View>
                      <Text style={styles.groupPrice}>${group.pricePerUnit.toFixed(2)}</Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${Math.min(progress, 100)}%` },
                        ]}
                      />
                    </View>

                    {remaining > 0 ? (
                      <>
                        <Text style={styles.remainingText}>
                          {remaining} more needed to reach target
                        </Text>
                        <Pressable
                          style={[
                            styles.joinGroupButton,
                            group.joined && styles.joinedButton,
                          ]}
                          onPress={() => joinGroup(selectedProductId, group.id)}
                          disabled={group.joined}
                        >
                          <Text style={styles.joinGroupButtonText}>
                            {group.joined ? "✓ Joined" : "Join Group 👥"}
                          </Text>
                        </Pressable>
                      </>
                    ) : (
                      <View style={styles.groupCompleteBadge}>
                        <Text style={styles.groupCompleteText}>✓ Group Full</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderPaymentModal = () => {
    if (!selectedGroup) return null;

    return (
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Payment</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowPaymentModal(false)}
                disabled={paymentLoading}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            {/* Payment Summary */}
            <View style={styles.paymentSummary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount to Pay:</Text>
                <Text style={styles.summaryValue}>${selectedGroup.pricePerUnit.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Group Target:</Text>
                <Text style={styles.summaryValue}>{selectedGroup.targetQuantity} units</Text>
              </View>

              <View style={[styles.summaryRow, { borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 12 }]}>
                <Text style={styles.summaryLabel}>Current Participants:</Text>
                <Text style={styles.summaryValue}>{selectedGroup.currentParticipants + 1}/{selectedGroup.targetQuantity}</Text>
              </View>
            </View>

            {/* Payment Method Selection */}
            <View style={styles.paymentMethodSection}>
              <Text style={styles.sectionTitle}>Select Payment Method</Text>
              
              <Pressable
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === "paypal" && styles.paymentMethodActive,
                ]}
                onPress={() => setPaymentMethod("paypal")}
                disabled={paymentLoading}
              >
                <View style={styles.radioButton}>
                  {paymentMethod === "paypal" && <View style={styles.radioDot} />}
                </View>
                <View style={styles.paymentMethodContent}>
                  <Text style={styles.paymentMethodTitle}>🅿️ PayPal</Text>
                  <Text style={styles.paymentMethodDesc}>Fast & Secure Payment</Text>
                </View>
              </Pressable>

              <Pressable
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === "stripe" && styles.paymentMethodActive,
                ]}
                onPress={() => setPaymentMethod("stripe")}
                disabled={paymentLoading}
              >
                <View style={styles.radioButton}>
                  {paymentMethod === "stripe" && <View style={styles.radioDot} />}
                </View>
                <View style={styles.paymentMethodContent}>
                  <Text style={styles.paymentMethodTitle}>💳 Credit/Debit Card</Text>
                  <Text style={styles.paymentMethodDesc}>Visa, Mastercard, Amex</Text>
                </View>
              </Pressable>
            </View>

            {/* Payment Info */}
            <View style={styles.paymentInfo}>
              <Text style={styles.infoText}>🔒 Your payment information is secure and encrypted</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.paymentActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
                disabled={paymentLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.payButton, paymentLoading && styles.payButtonDisabled]}
                onPress={processPayment}
                disabled={paymentLoading}
              >
                <Text style={styles.payButtonText}>
                  {paymentLoading ? "Processing..." : `Pay $${selectedGroup.pricePerUnit.toFixed(2)}`}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const mainImage = item.images?.find(img => img.is_main)?.image_url || 
                      item.images?.[0]?.image_url || 
                      "https://via.placeholder.com/300";
    
    const price = parseFloat(item.price?.toString() || '0');
    const isInWishlist = wishlist.includes(item.id);
    const inStock = item.stock > 0;
    const discount = Math.floor(Math.random() * 20) + 5;
    const groups = productGroups[item.id] || [];

    return (
      <Pressable
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
        android_ripple={{ color: "rgba(0,0,0,0.05)" }}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: mainImage }}
            style={styles.productImage}
          />
          
          {/* Discount Badge */}
          {inStock && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}

          {/* Stock Badge */}
          <View style={[styles.stockBadge, !inStock && styles.outOfStockBadge]}>
            <Text style={styles.badgeText}>
              {inStock ? `${item.stock} in stock` : "Out"}
            </Text>
          </View>

          {/* Wishlist Button */}
          <Pressable
            style={styles.wishlistButton}
            onPress={() => toggleWishlist(item.id)}
          >
            <Text style={styles.wishlistIcon}>
              {isInWishlist ? "❤️" : "🤍"}
            </Text>
          </Pressable>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          {item.description && (
            <Text style={styles.productDesc} numberOfLines={1}>
              {item.description}
            </Text>
          )}

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.ratingCount}>(124)</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${(price * (1 - discount / 100)).toFixed(2)}</Text>
            <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
          </View>

          {/* Group Info */}
          {groups.length > 0 && (
            <View style={styles.groupInfo}>
              <Text style={styles.groupInfoText}>
                👥 {groups[0]?.currentParticipants} in group
              </Text>
            </View>
          )}

          <Pressable
            style={[
              styles.addButton,
              !inStock && styles.addButtonDisabled,
            ]}
            disabled={!inStock}
            onPress={() => {
              setSelectedProductId(item.id);
              setShowGroupModal(true);
            }}
          >
            <Text style={styles.addButtonText}>
              {inStock ? "Join Group 👥" : "Out of Stock ❌"}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading amazing products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.logo}>🛍️ BuyForce</Text>
              <Text style={styles.tagline}>Smart Group Shopping</Text>
            </View>
            <Pressable style={styles.cartIcon}>
              <Text style={styles.cartNumber}>0</Text>
            </Pressable>
          </View>
        </View>

        {/* Promotional Banners */}
        <View style={styles.bannersSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: bannerScrollX } } }],
              { useNativeDriver: false }
            )}
          >
            {BANNERS.map(banner => (
              <View key={banner.id} style={styles.bannerWrapper}>
                <View style={[styles.banner, { backgroundColor: banner.color }]}>
                  <Text style={styles.bannerIcon}>{banner.icon}</Text>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          {renderBannerIndicators()}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="🔍 Search products, brands, or categories..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map(category => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.id && styles.categoryLabelActive,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>✨ Popular Products</Text>
          <Pressable>
            <Text style={styles.seeAll}>See All →</Text>
          </Pressable>
        </View>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <View style={styles.productsGrid}>
            {filteredProducts.map(product => (
              <View key={product.id} style={styles.gridItem}>
                {renderProductCard({ item: product })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try another search or select a different category</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 BuyForce. All rights reserved</Text>
        </View>
      </ScrollView>

      {/* Group Modal */}
      {renderGroupModal()}

      {/* Payment Modal */}
      {renderPaymentModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1e293b",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  cartIcon: {
    backgroundColor: "#3b82f6",
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  cartNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  bannersSection: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  bannerWrapper: {
    width: width,
    paddingHorizontal: 12,
  },
  banner: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  bannerIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cbd5e1",
  },
  activeIndicator: {
    backgroundColor: "#3b82f6",
    width: 24,
  },
  searchContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesContainer: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  categoriesContent: {
    paddingHorizontal: 8,
    gap: 8,
  },
  categoryButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
  },
  categoryLabelActive: {
    color: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
    backgroundColor: "#f1f5f9",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
  },
  stockBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outOfStockBadge: {
    backgroundColor: "#ef4444",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  wishlistIcon: {
    fontSize: 16,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  stars: {
    fontSize: 11,
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 9,
    color: "#94a3b8",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "800",
    color: "#10b981",
  },
  originalPrice: {
    fontSize: 11,
    color: "#cbd5e1",
    textDecorationLine: "line-through",
  },
  groupInfo: {
    backgroundColor: "#dbeafe",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  groupInfoText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1e40af",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#1e293b",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 20,
  },
  groupsList: {
    gap: 12,
  },
  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  groupTarget: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
  },
  groupParticipants: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  groupPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#10b981",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  remainingText: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 10,
  },
  joinGroupButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  joinedButton: {
    backgroundColor: "#10b981",
  },
  joinGroupButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  groupCompleteBadge: {
    backgroundColor: "#d1fae5",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  groupCompleteText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#065f46",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
  footer: {
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#94a3b8",
  },
  // Payment Modal Styles
  paymentSummary: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  paymentMethodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  paymentMethodActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#f0f7ff",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3b82f6",
  },
  paymentMethodContent: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  paymentMethodDesc: {
    fontSize: 12,
    color: "#94a3b8",
  },
  paymentInfo: {
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  infoText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  paymentActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  payButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});

