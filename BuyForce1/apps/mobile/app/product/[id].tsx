import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
    name: "AirPods Pro",
    price: 899,
    imageUrl:
      "https://images.unsplash.com/photo-1588156979435-1d26a06f5b26?auto=format&fit=crop&w=800&q=80",
    currentMembers: 62,
    goalMembers: 100,
  },
  {
    id: 2,
    name: "Running Shoes",
    price: 349,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    currentMembers: 91,
    goalMembers: 100,
  },
  {
    id: 3,
    name: "Samsung Galaxy Watch",
    price: 699,
    imageUrl:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    currentMembers: 12,
    goalMembers: 50,
  },
  {
    id: 4,
    name: "MacBook Pro M3",
    price: 8001,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    currentMembers: 18,
    goalMembers: 100,
  },
  {
    id: 5,
    name: "Gaming Pro Laptop",
    price: 5499,
    imageUrl:
      "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=800&q=80",
    currentMembers: 12,
    goalMembers: 50,
  },
  {
    id: 6,
    name: "MacBook Pro M3",
    price: 8001,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    currentMembers: 10,
    goalMembers: 100,
  },
];

export default function ProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // אם ה-ID מתחיל ב-"p", הסר אותו והמר למספר
  const numericId = id?.startsWith("p") 
    ? Number(id.replace("p", ""))
    : Number(id);
    
  const product = PRODUCTS.find(
    (p) => p.id === numericId
  );

  if (!product || Number.isNaN(numericId)) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Product not found</Text>
      </SafeAreaView>
    );
  }

  const progress = Math.round(
    (product.currentMembers / product.goalMembers) * 100
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ⬅️ חץ חזרה */}
      <Pressable
        style={styles.backButton}
        onPress={handleBack}
      >
        <Ionicons
          name="arrow-back"
          size={26}
          color="white"
        />
      </Pressable>

      {/* 🖼️ תמונת מוצר */}
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* 🏷️ שם */}
      <Text style={styles.title}>
        {product.name}
      </Text>

      {/* 💰 מחיר */}
      <Text style={styles.price}>
        ₪{product.price}
      </Text>

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
        <Text style={styles.badge}>
          🔥 Almost there
        </Text>
      )}

      {/* ✅ Join Group */}
      <Pressable
        style={styles.joinButton}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/groups",
            params: {
              productId: product.id.toString(),
            },
          })
        }
      >
        <Text style={styles.joinText}>
          Join Group
        </Text>
      </Pressable>

    </SafeAreaView>
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

  backButton: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    padding: 6,
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
