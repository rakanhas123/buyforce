import HomePage from "../pages/home/HomePage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import CategoryPage from "../pages/category/CategoryPage";
import SearchResultsPage from "../pages/search/SearchResultsPage";

// Auth pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

// Protected pages
import ProfilePage from "../pages/profile/ProfilePage";
import WishlistPage from "../pages/wishlist/WishlistPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import ProductPage from "../pages/product/ProductPage";

// Context
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

        {/* Public auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Protected pages */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
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

      </Routes>
    </BrowserRouter>
  );
}
