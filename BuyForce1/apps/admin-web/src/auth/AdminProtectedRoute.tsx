import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  const loc = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }

  return <>{children}</>;
}
