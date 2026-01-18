import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AdminAuthProvider } from "./auth/AdminAuthContext";
import AdminProtectedRoute from "./auth/AdminProtectedRoute";
import AdminLayout from "./layout/AdminLayout";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashBoardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminGroupsPage from "./pages/AdminGroupsPage";
import AdminWishlistPage from "./pages/AdminWishlistPage";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
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
            {/* כשנכנסים ל /admin -> ישר לדשבורד */}
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="groups" element={<AdminGroupsPage />} />
            <Route path="wishlist" element={<AdminWishlistPage />} />
          </Route>

          {/* כל דבר אחר -> /admin */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  </React.StrictMode>
);
