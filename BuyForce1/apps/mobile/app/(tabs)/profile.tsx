import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const [edit, setEdit] = useState(false);

  const [name, setName] = useState("Customer Name");
  const [email, setEmail] = useState("customer@mail.com");
  const [phone, setPhone] = useState("050-0000000");
  const [address, setAddress] = useState("Tel Aviv");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Pressable onPress={() => setEdit(!edit)}>
          <Text style={styles.edit}>
            {edit ? "Save" : "Edit"}
          </Text>
        </Pressable>
      </View>

      {/* Fields */}
      <Field
        label="Customer Name"
        value={name}
        setValue={setName}
        edit={edit}
      />

      <Field
        label="Email"
        value={email}
        setValue={setEmail}
        edit={edit}
      />

      <Field
        label="Phone Number"
        value={phone}
        setValue={setPhone}
        edit={edit}
      />

      <Field
        label="Address"
        value={address}
        setValue={setAddress}
        edit={edit}
      />

      {/* Links */}
      <Pressable style={styles.link}>
        <Text style={styles.linkText}>Payments</Text>
      </Pressable>

      <Pressable style={styles.link}>
        <Text style={styles.linkText}>Orders</Text>
      </Pressable>

      {/* Logout */}
      <Pressable
        style={styles.logout}
        onPress={() => router.replace("/(auth)/login")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

/* 🔹 Field Component */
function Field({
  label,
  value,
  setValue,
  edit,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  edit: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {edit ? (
        <TextInput
          value={value}
          onChangeText={setValue}
          style={styles.input}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  edit: {
    color: "#3b82f6",
    fontSize: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#141414",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  link: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
  },
  logout: {
    marginTop: 30,
    backgroundColor: "#1a0f0f",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#f87171",
    fontWeight: "700",
  },
});
