import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { PRODUCTS, Product } from "../lib/products";

export default function HomeScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  /* ➕ Join Group */
  const joinGroup = (id: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              currentMembers: (p.currentMembers ?? 0) + 1,
              price: p.price + 1,
            }
          : p
      )
    );
  };

  /* 🔍 סינון לפי חיפוש + קטגוריה */
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "all" || p.category === category;

      return matchSearch && matchCategory;
    });
  }, [search, category, products]);

  const renderItem = ({ item }: { item: Product }) => {
    const progress = Math.min(
      100,
      Math.round(
        ((item.currentMembers ?? 0) /
          (item.goalMembers ?? 100)) *
          100
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

          <Pressable
            style={styles.joinButton}
            onPress={() => joinGroup(item.id)}
          >
            <Text style={styles.joinText}>Join Group</Text>
          </Pressable>
        </View>
      </View>
    );
  };

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

      <View style={styles.main}>
       

        {/* Products */}
        <FlatList
          style={{ flex: 1 }}
          data={filteredProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.empty}>אין מוצרים להצגה</Text>
          }
        />
      </View>
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
  main: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  sidebar: {
    width: 120,
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  sideItem: {
    color: "#fff",
    marginBottom: 12,
  },
  viewMore: {
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
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
  joinButton: {
    marginTop: 10,
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    borderRadius: 10,
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
