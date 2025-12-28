import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getGroupById, payForProduct } from "../../api/groupsApi";
import { useAuth } from "../../context/AuthContext";

type Group = {
  id: string;
  product_id: number;
  price: number;
  status: string; // open | closed
};

export default function GroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    loadGroup();
  }, []);

  const loadGroup = async () => {
    try {
      const data = await getGroupById(id!, token!);
      setGroup(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayProduct = async () => {
    try {
      setPaying(true);
      await payForProduct(id!, token!);
      setPaid(true);
    } catch (err) {
      alert("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group #{group.id}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Product ID</Text>
        <Text style={styles.value}>{group.product_id}</Text>

        <Text style={styles.label}>Product Price</Text>
        <Text style={styles.value}>₪{group.price}</Text>

        <Text style={styles.label}>Status</Text>
        <Text
          style={[
            styles.value,
            group.status === "closed" && styles.closed,
          ]}
        >
          {group.status.toUpperCase()}
        </Text>
      </View>

      {/* 🟡 Group open */}
      {group.status !== "closed" && (
        <Text style={styles.info}>
          ⏳ Waiting for group to complete
        </Text>
      )}

      {/* 🟢 Group closed – pay product */}
      {group.status === "closed" && !paid && (
        <Pressable
          style={styles.payBtn}
          onPress={handlePayProduct}
          disabled={paying}
        >
          <Text style={styles.payText}>
            {paying ? "Processing..." : "Pay for Product"}
          </Text>
        </Pressable>
      )}

      {/* ✅ Paid */}
      {paid && (
        <Text style={styles.success}>
          ✅ Product paid successfully
        </Text>
      )}
    </View>
  );
}

/* =========================
   Styles
========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b0b0f",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
  },
  value: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  closed: {
    color: "#22c55e",
    fontWeight: "700",
  },
  info: {
    color: "#facc15",
    textAlign: "center",
    marginTop: 20,
  },
  payBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 26,
    alignItems: "center",
    marginTop: 20,
  },
  payText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  success: {
    color: "#22c55e",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
