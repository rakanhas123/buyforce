import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./app/lib/AuthContext";
import ProtectedRoute from "./app/lib/ProtectedRoute";

import App from "./App";
import LoginPage from "./app/auth/LoginPage";
import RegisterPage from "./app/auth/RegisterPage";

import HomePage from "./app/pages/HomePage";
import CategoriesPage from "./app/pages/CategoriesPage";
import CategoryFeedPage from "./app/pages/CategoryFeedPage";

import ProductPage from "./product/ProductPage";
import ProductDetailsPage from "./product/ProductDetailsPage";

import GroupsPage from "./app/group/GroupsPage";
import GroupDetailsPage from "./app/group/GroupDetailsPage";

import WishlistPage from "./app/pages/WishlistPage";
import MyGroupsPage from "./app/pages/MyGroupsPage";

// ✅ ADD THESE (create the files below)
import NotificationsPage from "./app/pages/NotificationsPage";
import SearchPage from "./app/pages/SearchPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* protected layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />

            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:slug" element={<CategoryFeedPage />} />

            <Route path="products" element={<ProductPage />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />

            <Route path="groups" element={<GroupsPage />} />
            <Route path="groups/:id" element={<GroupDetailsPage />} />

            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="my-groups" element={<MyGroupsPage />} />

            {/* ✅ THESE WERE MISSING -> caused redirect to home */}
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
