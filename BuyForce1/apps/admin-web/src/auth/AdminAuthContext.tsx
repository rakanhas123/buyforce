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

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
