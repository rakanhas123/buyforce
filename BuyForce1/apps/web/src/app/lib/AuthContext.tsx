import React, { createContext, useContext, useMemo, useState } from "react";
import * as authApi from "../../api/authApi";

type AuthState = {
  user: authApi.AuthUser | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: (user: authApi.AuthUser, accessToken: string) => void;
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

  function setAuth(u: authApi.AuthUser, token: string) {
    setUser(u);
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("accessToken", token);
  }

  async function login(email: string, password: string) {
    const data = await authApi.login({ email, password });
    setAuth(data.user, data.accessToken);
  }

  async function register(fullName: string, email: string, password: string) {
    const data = await authApi.register({ fullName, email, password });
    setAuth(data.user, data.accessToken);
  }

  function logout() {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  }

  const value = useMemo(
    () => ({ user, accessToken, login, register, logout, setAuth }),
    [user, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
