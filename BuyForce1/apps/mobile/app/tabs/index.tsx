import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCard from "../../components/ProductCard";
import { useRouter } from "expo-router";

type Product = {
  id: number;
  name: string;
  price: number;
  joined: boolean;
  inWishlist: boolean;
};

export default function HomePage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "AirPods Pro", price: 799, joined: false, inWishlist: false },
    { id: 2, name: "iPhone Case", price: 129, joined: false, inWishlist: false },
    { id: 3, name: "Power Bank", price: 199, joined: false, inWishlist: false },
  ]);

  // ---- Load wishlist from AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("wishlist");
      if (!saved) return;

      const ids: number[] = JSON.parse(saved);
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          inWishlist: ids.includes(p.id),
        }))
      );
    })();
  }, []);

  // ---- Toggle wishlist ❤️
  const toggleWishlist = async (id: number) => {
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, inWishlist: !p.inWishlist } : p
      );

      const ids = updated
        .filter((p) => p.inWishlist)
        .map((p) => p.id);

      AsyncStorage.setItem("wishlist", JSON.stringify(ids));
      return updated;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.products}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              joined={product.joined}
              inWishlist={product.inWishlist}
              onJoinPress={() =>
                console.log("Pay 1₪ & Join group", product.id)
              }
              onToggleWishlist={() =>
                toggleWishlist(product.id)
              }
              onPress={() =>
                router.push(`/product/${product.id}`)
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  products: {
    flexDirection: "row",
    gap: 12,
  },
});
