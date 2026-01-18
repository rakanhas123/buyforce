<<<<<<< HEAD
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import type { ReactElement } from "react";

export default function AdminProtectedRoute({ children }: { children: ReactElement }) {
  const { token } = useAdminAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
}
