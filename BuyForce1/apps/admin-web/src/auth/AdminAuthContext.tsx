<<<<<<< HEAD
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AdminAuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
  login: (t: string) => void;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  // load once
  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t && typeof t === "string") setTokenState(t);
  }, []);

  function setToken(t: string | null) {
    setTokenState(t);
    if (t) localStorage.setItem("admin_token", t); // ✅ raw string (no JSON.stringify)
    else localStorage.removeItem("admin_token");
  }

  function login(t: string) {
    setToken(t);
  }

  function logout() {
    setToken(null);
  }

  const value = useMemo(() => ({ token, setToken, login, logout }), [token]);
=======
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
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
<<<<<<< HEAD
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
=======
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  return ctx;
}
