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
import { useEffect, useMemo, useState } from "react";

/* ========= Types ========= */

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  currentMembers: number;
  goalMembers: number;
};

/* ========= Demo Data ========= */

const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Apple AirPods Pro",
    price: 899,
    imageUrl:
      "https://images.unsplash.com/photo-1588156979435-1d26a06f5b26?auto=format&fit=crop&w=800&q=60",
    currentMembers: 62,
    goalMembers: 100,
  },
  {
    id: 2,
    name: "Nike Air Force 1",
    price: 449,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=60",
    currentMembers: 91,
    goalMembers: 100,
  },
];

/* ========= API (optional & typed) ========= */

type ApiClient = {
  get: (url: string) => Promise<{ data: unknown[] }>;
};

let api: ApiClient | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  api = require("../../src/config/api").default as ApiClient;
} catch {
  api = null;
}

/* ========= Component ========= */

export default function HomeScreen() {
  const router = useRouter();

  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        if (api) {
          const res = await api.get("/v1/products");

          const mapped: Product[] = res.data.map((p: any) => ({
            id: Number(p.id),
            name: String(p.name),
            price: Number(p.price),
            imageUrl: p.imageUrl ?? p.image_url,
            currentMembers: Number(p.currentMembers ?? 0),
            goalMembers: Number(p.goalMembers ?? 100),
          }));

          setProducts(mapped);
        } else {
          setProducts(DEMO_PRODUCTS);
        }
      } catch {
        setProducts(DEMO_PRODUCTS);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo<Product[]>(() => {
    if (!search.trim()) return products;
    return products.filter((p: Product) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  const renderItem = ({ item }: { item: Product }) => {
    const progress =
      Math.round((item.currentMembers / item.goalMembers) * 100) || 0;

    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}

        <View style={styles.body}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>₪{item.price}</Text>

          <Text style={styles.progressText}>
            {item.currentMembers}/{item.goalMembers} מצטרפים
          </Text>

          <View style={styles.progressBg}>
            <View
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BuyForce</Text>

      <TextInput
        placeholder="חיפוש מוצר..."
        placeholderTextColor="#9ca3af"
        value={search}
        onChangeText={(text: string) => setSearch(text)}
        style={styles.search}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item: Product) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>אין מוצרים</Text>
        }
      />
    </View>
  );
}

/* ========= Styles ========= */

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
    marginBottom: 16,
  },
  search: {
    backgroundColor: "#141414",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  body: {
    padding: 12,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
  },
  price: {
    color: "#3b82f6",
    marginVertical: 6,
  },
  progressText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  progressBg: {
    height: 8,
    backgroundColor: "#1f1f1f",
    borderRadius: 999,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
  empty: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 40,
  },
});
