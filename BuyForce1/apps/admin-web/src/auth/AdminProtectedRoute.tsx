import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import type { ReactElement } from "react";

export default function AdminProtectedRoute({ children }: { children: ReactElement }) {
  const { token } = useAdminAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
