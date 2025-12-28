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
    image: "...",
    members: 62,
    goal: 100,
    categoryId: "accessories",
    productId: 1, // 🔗 קשור למוצר AirPods
  },
  {
    id: "g2",
    title: "Running Shoes Group",
    price: 349,
    image: "...",
    members: 12,
    goal: 50,
    categoryId: "sports",
    productId: 3, // 🔗 קשור לנעליים
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
    title: "Smartphone Pro",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60",
    members: 91,
    goal: 100,
    categoryId: "mobile",
    productId: 2,
  },
  {
  id: "g5",
  title: "Luxury Perfume Group",
  price: 249,
  image:
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=60",
  members: 18,
  goal: 100,
  categoryId: "perfume",
  productId: 4, // ✅ הבושם
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


  return (
    <View style={styles.container}>
      {/* ===== Header ===== */}
      <Text style={styles.title}>Groups</Text>
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
              onPress={() => router.push("/groups")}
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
