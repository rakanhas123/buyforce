import { Stack } from "expo-router";
import { AuthProvider } from "../lib/AuthContext";
import { WishlistProvider } from "../lib/WishlistContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </WishlistProvider>
    </AuthProvider>
  );
}
