import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./lib/AuthContext";
import ProtectedRoute from "./lib/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import AdminLayout from "./pages/AdminLayout";
import AdminGroupsPage from "./pages/AdminGroupsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminWishlistPage from "./pages/AdminWishlistPage";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/groups" replace />} />
            <Route path="groups" element={<AdminGroupsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="wishlist" element={<AdminWishlistPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin/groups" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
