import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, RefreshControl, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { categoriesApi, Category } from "../lib/api";

const CATEGORY_ICONS: { [key: string]: string } = {
  // Hebrew names
  "סמארטפונים": "",
  "מחשבים ניידים": "",
  "אביזרי אודיו": "",
  "קונסולות משחק": "",
  "מצלמות": "",
  "אביזרי מחשב": "",
  "מוצרי חשמל": "",
  "אביזרי Apple": "",
  "טכנולוגיה לבית חכם": "",
  "ספורט וכושר": "",
  // English names (from database)
  "Phones": "",
  "Laptops": "",
  "Headphones": "",
  "Tablets": "",
  "Cameras": "",
  "Gaming": "",
  "Accessories": "",
  "Smart Home": "",
  "Wearables": "",
  "Audio": "",
};

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  const getIcon = (name: string) => {
    return CATEGORY_ICONS[name] || "📦";
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <Text style={styles.subtitle}>
        Select a category to view products
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              router.push({
                pathname: "/Screens/products",
                params: { categoryId: item.id },
              })
            }
          >
            {item.image_url ? (
              <Image 
                source={{ uri: item.image_url }} 
                style={styles.categoryImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.icon}>{getIcon(item.name)}</Text>
            )}
            <Text style={styles.cardTitle}>{item.name}</Text>

            <View style={styles.selectBadge}>
              <Text style={styles.selectText}>Select</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No categories to display</Text>
          </View>
        }
      />
    </View>
  );
}

/* ================= Styles ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b0b0f",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9a9a9a",
    marginTop: 12,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    color: "#9a9a9a",
    marginBottom: 18,
    marginTop: 4,
    fontSize: 13,
  },

  list: {
    gap: 14,
  },

  row: {
    gap: 14,
  },

  card: {
    flex: 1,
    backgroundColor: "#141421",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#1f1f2e",
    overflow: "hidden",
  },

  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },

  icon: {
    fontSize: 36,
  },

  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  selectBadge: {
    marginTop: 6,
    backgroundColor: "#ffffff22",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },

  selectText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    color: "#9a9a9a",
    fontSize: 16,
  },});
