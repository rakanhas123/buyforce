import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

// ניסיון לייבא API אמיתי (אם קיים)
let api: any = null;
try {
  api = require("../../src/config/api").default;
} catch {
  api = null;
}

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  currentMembers?: number;
  goalMembers?: number;
};

const DEMO_PRODUCT: Product = {
  id: 1,
  name: "Apple AirPods Pro",
  price: 899,
  description: "אוזניות אלחוטיות עם ביטול רעשים אקטיבי.",
  imageUrl:
    "https://images.unsplash.com/photo-1588156979435-1d26a06f5b26?auto=format&fit=crop&w=900&q=60",
  currentMembers: 62,
  goalMembers: 100,
};

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (api?.get && id) {
          const res = await api.get(`/v1/products/${id}`);
          const p = res.data;

          setProduct({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            imageUrl: p.imageUrl || p.image_url,
            currentMembers: p.currentMembers ?? 0,
            goalMembers: p.goalMembers ?? 100,
          });
        } else {
          setProduct(DEMO_PRODUCT);
        }
      } catch {
        setProduct(DEMO_PRODUCT);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>טוען מוצר...</Text>
      </View>
    );
  }

  const progress = Math.min(
    100,
    Math.round(
      ((product.currentMembers ?? 0) /
        (product.goalMembers ?? 100)) *
        100
    )
  );

  return (
    <View style={styles.container}>
      {product.imageUrl && (
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
      )}

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>₪{product.price}</Text>

      <Text style={styles.description}>
        {product.description || "אין תיאור למוצר"}
      </Text>

      <View style={styles.progressBox}>
        <Text style={styles.progressText}>
          {product.currentMembers}/{product.goalMembers} מצטרפים
        </Text>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <Pressable style={styles.joinBtn}>
        <Text style={styles.joinText}>הצטרפות לקנייה קבוצתית</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← חזרה</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  price: {
    color: "#3b82f6",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    color: "#cfcfcf",
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  progressBox: {
    marginBottom: 20,
  },
  progressText: {
    color: "#9ca3af",
    marginBottom: 6,
  },
  progressBg: {
    height: 10,
    backgroundColor: "#1f1f1f",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
  joinBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  joinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  back: {
    color: "#9ca3af",
    textAlign: "center",
  },
  center: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 10,
  },
});
