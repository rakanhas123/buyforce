import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BuyForce</Text>
      <Text style={styles.subtitle}>
        Group buying made simple
      </Text>

      <Pressable
        style={styles.card}
        onPress={() => router.push("/categories")}
      >
        <Text style={styles.cardTitle}>Browse Categories</Text>
        <Text style={styles.cardSubtitle}>
          Start a group & save together
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 30,
  },
  card: {
    width: "100%",
    backgroundColor: "#141421",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#aaa",
    marginTop: 6,
    fontSize: 13,
  },
});
