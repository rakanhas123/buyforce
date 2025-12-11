import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";

import LoginPage from "../pages/auth/LoginPage";
import ProfilePage from "../pages/profile/ProfilePage";
import WishlistPage from "../pages/wishlist/wishlistPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";

import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Pages */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <WishlistPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />

        {/* Home (זמני) */}
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}
