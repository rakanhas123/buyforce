import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Item = {
  id: number;
  name: string;
  price: number;
};

export default function WishlistPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("wishlist");
      if (!saved) return;

      const ids: number[] = JSON.parse(saved);

      // דמו – בהמשך יבוא מה־API
      const all = [
        { id: 1, name: "AirPods Pro", price: 799 },
        { id: 2, name: "iPhone Case", price: 129 },
        { id: 3, name: "Power Bank", price: 199 },
      ];

      setItems(all.filter((p) => ids.includes(p.id)));
    })();
  }, []);

  if (!items.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No items in wishlist ❤️</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>₪{item.price}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    padding: 16,
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingVertical: 12,
  },
  name: {
    color: "white",
    fontWeight: "600",
  },
  price: {
    color: "#4ade80",
  },
});
