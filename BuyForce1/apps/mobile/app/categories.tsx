import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type Category = {
  id: string;
  title: string;
  icon: string;
};

const CATEGORIES: Category[] = [
  { id: "electronics", title: "Electronics", icon: "🎧" },
  { id: "fashion", title: "Fashion", icon: "👟" },
  { id: "home", title: "Home", icon: "🏠" },
  { id: "beauty", title: "Beauty", icon: "🧴" },
];

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <Text style={styles.subtitle}>
        Choose a category to see available products
      </Text>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
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
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>

            <View style={styles.selectBadge}>
              <Text style={styles.selectText}>Select</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

/* ================= Styles ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD:BuyForce1/apps/mobile/app/categories.tsx
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#0b0b0b',
=======
    padding: 16,
    backgroundColor: "#0b0b0f",
>>>>>>> ac947e26b9ab2b39954631bbe7be05b34a1b266b:BuyForce1/apps/mobile/app/(tabs)/categories.tsx
  },

  title: {
<<<<<<< HEAD:BuyForce1/apps/mobile/app/categories.tsx
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
=======
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
>>>>>>> ac947e26b9ab2b39954631bbe7be05b34a1b266b:BuyForce1/apps/mobile/app/(tabs)/categories.tsx
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
<<<<<<< HEAD:BuyForce1/apps/mobile/app/categories.tsx
    width: 120,
    height: 150,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
=======
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
>>>>>>> ac947e26b9ab2b39954631bbe7be05b34a1b266b:BuyForce1/apps/mobile/app/(tabs)/categories.tsx
  },

  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  icon: {
    fontSize: 36,
  },

  cardTitle: {
    color: "white",
    fontSize: 16,
<<<<<<< HEAD:BuyForce1/apps/mobile/app/categories.tsx
    textAlign: 'center',
    color: '#fff',
=======
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
>>>>>>> ac947e26b9ab2b39954631bbe7be05b34a1b266b:BuyForce1/apps/mobile/app/(tabs)/categories.tsx
  },
});
