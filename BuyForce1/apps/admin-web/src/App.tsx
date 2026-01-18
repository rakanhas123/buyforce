import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "./auth/AdminAuthContext";
import AdminProtectedRoute from "./auth/AdminProtectedRoute";
import AdminLayout from "./layout/AdminLayout";

import AdminLoginPage from "./pages/AdminLoginPage";

// pages
import AdminHomePage from "./pages/AdminHomePage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminGroupsPage from "./pages/AdminGroupsPage";
import AdminWishlistPage from "./pages/AdminWishlistPage";
import AdminUsersPage from "./pages/AdminUsersPage";

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/home" replace />} />
            <Route path="home" element={<AdminHomePage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="groups" element={<AdminGroupsPage />} />
            <Route path="wishlist" element={<AdminWishlistPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
