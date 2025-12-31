import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { PRODUCTS, Product } from "../lib/products";
import { useWishlist } from "../lib/WishlistContext";

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlist } = useWishlist();
  
  const wishlistProducts = PRODUCTS.filter(p =>
    wishlist.includes(p.id)
  );

  const renderItem = ({ item }: { item: Product }) => {
    const progress = Math.min(
      100,
      Math.round(
        ((item.currentMembers ?? 0) / (item.goalMembers ?? 100)) * 100
      )
    );

    return (
      <View style={styles.card}>
        <Pressable onPress={() => router.push(`/product/${item.id}`)}>
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />
          )}
        </Pressable>

        <View style={styles.cardBody}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>₪{item.price}</Text>

          <Text style={styles.progressText}>
            {item.currentMembers}/{item.goalMembers} מצטרפים
          </Text>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>רשימת המשאלות שלי ❤️</Text>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            עדיין לא הוספת מוצרים לרשימת המשאלות
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlistProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
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
    color: "#3b82f6",
    fontWeight: "700",
    marginVertical: 4,
  },
  progressText: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  progressBg: {
    height: 8,
    backgroundColor: "#1f1f1f",
    borderRadius: 999,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 999,
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
