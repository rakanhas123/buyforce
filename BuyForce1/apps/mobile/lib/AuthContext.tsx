import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, User } from "./api";
import { setToken as saveToken, clearToken as removeToken } from "./auth";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "buyforce_token";
const USER_KEY = "buyforce_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token;

  const persist = async (t: string, u: User) => {
    setToken(t);
    setUser(u);

    // ✅ store token where api.ts can read it per-request
    await saveToken(t);

    // (optional) keep these keys too since your app already uses them
    await AsyncStorage.setItem(TOKEN_KEY, t);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const clear = async () => {
    setToken(null);
    setUser(null);

    await removeToken();

    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  };

  const refreshMe = async () => {
    if (!token) return;
    try {
      const me = await authApi.me();
      setUser(me);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(me));
    } catch {
      // token invalid -> logout
      await clear();
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const savedUser = await AsyncStorage.getItem(USER_KEY);

        if (savedToken) {
          setToken(savedToken);

          // ✅ ensure api.ts can read the token
          await saveToken(savedToken);

          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {}
          }

          // verify token is still valid
          // (this uses authApi.me which will send Authorization header)
          await (async () => {
            try {
              const me = await authApi.me();
              setUser(me);
              await AsyncStorage.setItem(USER_KEY, JSON.stringify(me));
            } catch {
              await clear();
            }
          })();
        }
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    await persist(res.accessToken, res.user);
  };

  const register = async (fullName: string, email: string, password: string) => {
    const res = await authApi.register(fullName, email, password);
    await persist(res.accessToken, res.user);
  };

  const logout = async () => {
    await clear();
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated, isLoading, login, register, logout, refreshMe }),
    [user, token, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
