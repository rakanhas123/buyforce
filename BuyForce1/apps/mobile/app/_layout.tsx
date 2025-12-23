// apps/mobile/app/_layout.jsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0b0b0b" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#0b0b0b" },
        }}
      >
        {/* Tabs: Home / Wishlist / Profile / Notifications */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Product details */}
        <Stack.Screen
          name="product/[id]"
          options={{
            title: "Product",
          }}
        />
      </Stack>
    </>
  );
}
