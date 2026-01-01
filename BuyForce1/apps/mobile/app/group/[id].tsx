import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function GroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group ID:</Text>
      <Text style={styles.id}>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0b0f",
  },
  title: {
    color: "white",
    fontSize: 22,
    marginBottom: 10,
  },
  id: {
    color: "#22c55e",
    fontSize: 26,
    fontWeight: "bold",
  },
});
