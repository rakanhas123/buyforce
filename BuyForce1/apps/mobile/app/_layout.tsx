// apps/mobile/app/_layout.jsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./lib/AuthContext";
import { WishlistProvider } from "./lib/WishlistContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <StatusBar style="light" />

        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#0b0b0b" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "700" },
            contentStyle: { backgroundColor: "#0b0b0b" },
            headerShown: false,
          }}
        >
          {/* Auth screens */}
          <Stack.Screen
            name="auth/login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="auth/register"
            options={{ headerShown: false }}
          />

          {/* Tabs: Home / Wishlist / Profile / Notifications */}
          <Stack.Screen
            name="tabs"
            options={{ headerShown: false }}
          />

          {/* Product details */}
          <Stack.Screen
            name="product/[id]"
            options={{
              title: "Product",
            }}
          />

          {/* Group details */}
          <Stack.Screen
            name="group/[id]"
            options={{
              title: "Group Details",
            }}
          />
        </Stack>
      </WishlistProvider>
    </AuthProvider>
  );
}
