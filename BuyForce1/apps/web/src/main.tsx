import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./app/lib/AuthContext";
import ProtectedRoute from "./app/lib/ProtectedRoute";

import LoginPage from "./app/auth/LoginPage";
import RegisterPage from "./app/auth/RegisterPage";

import GroupsPage from "./app/group/GroupsPage";
import GroupDetailsPage from "./app/group/GroupDetailsPage";

import PaymentCheckoutPage from "./app/pages/PaymentCheckoutPage";
import PaymentSuccessPage from "./app/pages/PaymentSuccessPage";
import PaymentCancelPage from "./app/pages/PaymentCancelPage";

import WishlistPage from "./app/pages/WishlistPage";
import AppLayout from "./app/layout/AppLayout";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* protected layout (everything inside gets topbar) */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/groups" replace />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:id" element={<GroupDetailsPage />} />

            <Route path="/payment/checkout" element={<PaymentCheckoutPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />

            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/groups" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
