import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AdminAuthValue = {
  adminKey: string | null;
  isAuthenticated: boolean;
  login: (adminKey: string) => void;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

const KEY = "ADMIN_KEY";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminKey, setAdminKey] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved && saved.trim()) setAdminKey(saved);
  }, []);

  const login = (key: string) => {
    const k = String(key || "").trim();
    localStorage.setItem(KEY, k);
    setAdminKey(k);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setAdminKey(null);
  };

  const value = useMemo(
    () => ({
      adminKey,
      isAuthenticated: !!adminKey,
      login,
      logout,
    }),
    [adminKey]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
