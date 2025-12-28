import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

/* =========================
   🔹 טיפוס מוצר
   ========================= */
type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  currentMembers: number;
  goalMembers: number;
};

/* =========================
   🔹 דאטה
   ========================= */
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Apple AirPods Pro",
    price: 899,
    imageUrl:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MWP22_AV1",
    currentMembers: 62,
    goalMembers: 100,
  },
  {
    id: 2,
    name: "Gaming Laptop",
    price: 4999,
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/01/22/19/12/laptop-2001346_1280.jpg",
    currentMembers: 91,
    goalMembers: 100,
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 349,
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/08/06/06/42/running-shoes-2581824_1280.jpg",
    currentMembers: 12,
    goalMembers: 50,
  },
  {
    id: 4,
    name: "Luxury Perfume",
    price: 249,
    imageUrl:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
    currentMembers: 18,
    goalMembers: 100,
  },
];

export default function ProductScreen() {
  /* =========================
     🔹 ניווט + פרמטרים
     ========================= */
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const numericId = Number(id?.replace("p", ""));
  const product = PRODUCTS.find(
    (p) => p.id === numericId
  );

  if (!product || Number.isNaN(numericId)) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product not found</Text>
      </View>
    );
  }
  /* =========================
   🔹 מיפוי מוצר → קבוצה
   ========================= */
const PRODUCT_TO_GROUP: Record<number, string> = {
  1: "g1",
  2: "g2",
  3: "g3",
  4: "g4",
};


  const progress = Math.round(
    (product.currentMembers / product.goalMembers) * 100
  );

  return (
    <View style={styles.container}>

      {/* 🖼️ תמונת מוצר */}
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* 🏷️ שם */}
      <Text style={styles.title}>{product.name}</Text>

      {/* 💰 מחיר */}
      <Text style={styles.price}>₪{product.price}</Text>

      {/* 📊 Progress */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%` },
          ]}
        />
      </View>

      <Text style={styles.meta}>
        {product.currentMembers}/{product.goalMembers} מצטרפים ({progress}%)
      </Text>

      {progress >= 80 && (
        <Text style={styles.badge}>🔥 Almost there</Text>
      )}

      {/* ✅ כפתור Join Group – מעודכן */}
 <Pressable
  style={styles.joinButton}
  onPress={() =>
    router.push({
      pathname: "/groups",
      params: { productId: product.id.toString() },
    })
  }
>
  <Text style={styles.joinText}>Join Group</Text>
</Pressable>


    </View>
  );
}

/* =========================
   🎨 Styles
   ========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b0b0f",
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 6,
  },
  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "#cfcfcf",
    marginBottom: 18,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#1f1f2e",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
  meta: {
    color: "#9a9a9a",
    fontSize: 13,
    marginBottom: 10,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#2b2b15",
    color: "#ffd700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: "bold",
    marginBottom: 24,
    fontSize: 13,
  },
  joinButton: {
    marginTop: "auto",
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
  },
  joinText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  error: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
  },
});
