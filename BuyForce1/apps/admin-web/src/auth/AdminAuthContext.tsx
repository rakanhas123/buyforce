import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AdminAuthValue = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (t: string | null) => void;
  login: (t: string) => void;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

const STORAGE_KEY = "admin_token";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  // ✅ Load token once (Web only)
  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_KEY);
      if (t && typeof t === "string" && t.trim()) {
        setTokenState(t);
      }
    } catch {
      // localStorage not available (for example: native)
    }
  }, []);

  const setToken = (t: string | null) => {
    setTokenState(t);

    try {
      if (t && t.trim()) {
        localStorage.setItem(STORAGE_KEY, t);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage not available
    }
  };

  const login = (t: string) => {
    setToken(String(t || "").trim());
  };

  const logout = () => {
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      setToken,
      login,
      logout,
    }),
    [token]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);

  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }

  return ctx;
}
