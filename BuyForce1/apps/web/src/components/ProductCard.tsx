import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  name: string;
  price: number;
  joined: boolean;
  inWishlist: boolean;
  onJoinPress: () => void;
  onToggleWishlist: () => void;
  onPress: () => void;
};

export default function ProductCard({
  name,
  price,
  joined,
  inWishlist,
  onJoinPress,
  onToggleWishlist,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: "#999" }}>Image</Text>
        </View>

        {/* ❤️ */}
        <TouchableOpacity style={styles.heart} onPress={onToggleWishlist}>
          <Text style={{ fontSize: 18 }}>
            {inWishlist ? "❤️" : "🤍"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.price}>₪{price}</Text>
        <Text style={styles.reviews}>⭐⭐⭐⭐☆</Text>

        <TouchableOpacity
          style={[styles.joinBtn, joined && styles.joinedBtn]}
          onPress={onJoinPress}
          disabled={joined}
        >
          <Text style={styles.joinText}>
            {joined ? "Joined ✓" : "Join – 1₪"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    width: 150,
    borderRadius: 12,
    position: "relative",
  },
  imagePlaceholder: {
    height: 80,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
  },
  heart: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  productName: {
    color: "white",
    fontWeight: "600",
  },
  price: {
    color: "#4ade80",
  },
  reviews: {
    color: "#facc15",
  },
  joinBtn: {
    backgroundColor: "#2563eb",
    padding: 6,
    marginTop: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  joinedBtn: {
    backgroundColor: "#16a34a",
  },
  joinText: {
    color: "white",
    fontWeight: "700",
  },
});
