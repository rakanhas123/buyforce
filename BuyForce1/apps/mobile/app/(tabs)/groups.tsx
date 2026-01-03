import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

/* ================= Types ================= */
type Group = {
  id: string;
  title: string;
  price: number;
  image: string;
  members: number;
  goal: number;
  categoryId: string;
  productId: number; //Added to link to product
};

/* ================= Data ================= */
const GROUPS: Group[] = [
  {
    id: "g1",
    title: "Apple AirPods Pro Group",
    price: 899,
    image: "https://images.unsplash.com/photo-1588156979435-1d26a06f5b26?auto=format&fit=crop&w=800&q=80",
    members: 62,
    goal: 100,
    categoryId: "accessories",
    productId: 1, // 🔗 קשור למוצר AirPods
  },
  {
    id: "g2",
    title: "Samsung Galaxy Watch Group",
    price: 699,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    members: 12,
    goal: 50,
    categoryId: "electronics",
    productId: 3, // 🔗 קשור ל-Samsung Galaxy Watch
  },
  {
    id: "g3",
    title: "Wireless Headphones",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60",
    members: 68,
    goal: 100,
    categoryId: "accessories",
    productId: 1,
  },
  {
    id: "g4",
    title: "Running Shoes Group",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    members: 91,
    goal: 100,
    categoryId: "sports",
    productId: 2,
  },
  {
    id: "g5",
    title: "MacBook Pro M3 Group",
    price: 8001,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    members: 18,
    goal: 100,
    categoryId: "electronics",
    productId: 4, // ✅ MacBook Pro M3
  },
  {
    id: "g6",
    title: "Gaming Pro Laptop Group",
    price: 5499,
    image:
      "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=80",
    members: 12,
    goal: 50,
    categoryId: "electronics",
    productId: 5, // ✅ Gaming Pro Laptop
  },
  {
    id: "g7",
    title: "Chanel No. 5 Group",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    members: 45,
    goal: 100,
    categoryId: "beauty",
    productId: 101, // 🔗 Chanel No. 5 (b1)
  },
  {
    id: "g8",
    title: "Dior Sauvage Group",
    price: 380,
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59926?auto=format&fit=crop&w=800&q=80",
    members: 67,
    goal: 100,
    categoryId: "beauty",
    productId: 102, // 🔗 Dior Sauvage (b2)
  },
  {
    id: "g9",
    title: "Tom Ford Black Orchid Group",
    price: 520,
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    members: 23,
    goal: 50,
    categoryId: "beauty",
    productId: 103, // 🔗 Tom Ford (b3)
  },
  {
    id: "g10",
    title: "Gucci Bloom Group",
    price: 420,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
    members: 58,
    goal: 100,
    categoryId: "beauty",
    productId: 104, // 🔗 Gucci Bloom (b4)
  },
  {
    id: "g11",
    title: "MacBook Pro M3 ",
    price: 8001,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    members: 42,
    goal: 100,
    categoryId: "electronics",
    productId: 6, // 🔗 MacBook Pro M3 (p6)
  },
];

/* ================= Screen ================= */
export default function GroupsScreen() {
const { categoryId, productId } = useLocalSearchParams<{
  categoryId?: string;
  productId?: string;
}>();
  const router = useRouter();
  const [sort, setSort] = useState<"popular" | "priceLow" | "priceHigh">(
    "popular"
  );
const filteredAndSorted = useMemo(() => {
  let list = GROUPS;

  // 🟢 סינון לפי מוצר (אם הגיע מ־Join Group)
  if (productId) {
    list = list.filter(
      (g) => g.productId === Number(productId)
    );
  }

  // 🟢 סינון לפי קטגוריה (אם קיים)
  if (categoryId) {
    list = list.filter(
      (g) => g.categoryId === categoryId
    );
  }

  // 🟢 מיון
  if (sort === "priceLow") {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sort === "priceHigh") {
    list = [...list].sort((a, b) => b.price - a.price);
  } else {
    list = [...list].sort(
      (a, b) => b.members / b.goal - a.members / a.goal
    );
  }

  return list;
}, [categoryId, productId, sort]);


  const handleBack = () => {
    router.push("/(tabs)/categories");
  };

  return (
    <View style={styles.container}>
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </Pressable>
        <Text style={styles.title}>Groups</Text>
      </View>
      {categoryId && (
        <Text style={styles.subtitle}>{categoryId}</Text>
      )}

      {/* ===== Filters ===== */}
      <View style={styles.filters}>
        <FilterButton
          label="Popular"
          active={sort === "popular"}
          onPress={() => setSort("popular")}
        />
        <FilterButton
          label="Price ↑"
          active={sort === "priceLow"}
          onPress={() => setSort("priceLow")}
        />
        <FilterButton
          label="Price ↓"
          active={sort === "priceHigh"}
          onPress={() => setSort("priceHigh")}
        />
      </View>

      {/* ===== Grid ===== */}
      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const progress = Math.round(
            (item.members / item.goal) * 100
          );

          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/product/${item.productId}`)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.price}>₪{item.price}</Text>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%` },
                  ]}
                />
              </View>

              <Text style={styles.meta}>
                {item.members}/{item.goal} members
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

/* ================= Filter Button ================= */
function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterButton,
        active && styles.filterButtonActive,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ================= Styles ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b0b0f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  backButton: {
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
    color: "#aaa",
    marginBottom: 12,
  },
  filters: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#ffffff22",
  },
  filterButtonActive: {
    backgroundColor: "#ffffff55",
  },
  filterText: {
    color: "#aaa",
    fontSize: 13,
  },
  filterTextActive: {
    color: "white",
    fontWeight: "600",
  },
  card: {
    flex: 1,
    backgroundColor: "#141421",
    borderRadius: 16,
    padding: 10,
    gap: 6,
  },
  image: {
    width: "100%",
    height: 110,
    borderRadius: 12,
  },
  cardTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  price: {
    color: "#aaa",
    fontSize: 13,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#ffffff22",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
  meta: {
    color: "#aaa",
    fontSize: 11,
  },
});
