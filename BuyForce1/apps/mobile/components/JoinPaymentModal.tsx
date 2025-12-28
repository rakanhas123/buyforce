import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";

type Props = {
  visible: boolean;
  onPay: () => void;
  onCancel: () => void;
};

export default function JoinPaymentModal({
  visible,
  onPay,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Join Group</Text>
          <Text style={styles.text}>Joining this group costs 1₪</Text>

          <TouchableOpacity style={styles.payBtn} onPress={onPay}>
            <Text style={styles.payText}>Pay 1₪</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    width: 260,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    color: "#ccc",
    marginBottom: 16,
  },
  payBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  payText: {
    color: "white",
    fontWeight: "700",
  },
  cancel: {
    color: "#f87171",
  },
});
