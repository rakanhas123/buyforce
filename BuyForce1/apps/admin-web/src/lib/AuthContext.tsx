import React, { createContext, useContext, useMemo, useState } from "react";
import * as authApi from "../api/authApi";

type AuthState = {
  user: authApi.AuthUser | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<authApi.AuthUser | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken");
  });

  async function login(email: string, password: string) {
    const data = await authApi.login({ email, password });
    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
  }

  function logout() {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  }

  const value = useMemo(() => ({ user, accessToken, login, logout }), [user, accessToken]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
