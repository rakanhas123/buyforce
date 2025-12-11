import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { getUserProfile, updateUserProfile } from "../api/userApi";

export type PaymentMethod = {
  id: number;
  type: "visa" | "mastercard" | "paypal";
  last4: string;
};

export type UserProfile = {
  id: string;
  fullName: string;
  language: "he" | "en" | "ar";
  paymentMethods: PaymentMethod[];
};

type UserContextType = {
  profile: UserProfile | null;
  loading: boolean;
  updateNameAndLanguage: (fullName: string, language: UserProfile["language"]) => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setProfile(null);
        return;
      }
      setLoading(true);
      try {
        const data = await getUserProfile(token);
        setProfile(data);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  const updateNameAndLanguage = async (
    fullName: string,
    language: UserProfile["language"]
  ) => {
    if (!token || !profile) return;
    const updated = await updateUserProfile(token, { fullName, language });
    setProfile(updated);
  };

  return (
    <UserContext.Provider value={{ profile, loading, updateNameAndLanguage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
