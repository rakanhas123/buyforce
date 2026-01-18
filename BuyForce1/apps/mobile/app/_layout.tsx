<<<<<<< HEAD
// apps/mobile/app/_layout.jsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./lib/AuthContext";
import { WishlistProvider } from "./lib/WishlistContext";
=======
import { Stack } from "expo-router";
import { AuthProvider } from "../lib/AuthContext";
import { WishlistProvider } from "../lib/WishlistContext";
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
<<<<<<< HEAD
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
=======
        <Stack screenOptions={{ headerShown: false }} />
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
      </WishlistProvider>
    </AuthProvider>
  );
}
