"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import toast from "react-hot-toast";
import { Commerce } from "@/types/commerce";

type UserContextType = {
  userName: string | null;
  businessId: string | null;
  businessName: string | null;
  commerce: Commerce | null;
  login: (name: string, isAdmin: boolean, commerce?: Commerce, businessName?: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [commerce, setCommerce] = useState<Commerce | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const URL_API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        const response = await fetch(`${URL_API}/auth/me`, {
          credentials: "include",
          headers: token && token !== "null" ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.userName);
          setIsAdmin(data.isAdmin);
          setIsSuperAdmin(data.role === "SUPERADMIN");
          setBusinessId(data.businessId);
          setCommerce(data.commerce);
          setBusinessName(data.businessName);
        } else {
          setUserName(null);
          setIsAdmin(false);
          setBusinessId(null);
          setCommerce(null);
          setBusinessName(null);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [URL_API]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        fetch(`${URL_API}/auth/me`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      },
      10 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [URL_API]);

  const login = (name: string, isAdmin: boolean, commerce?: Commerce, businessName?: string) => {
    const nameAdmin = name.trim().toLowerCase();
    setUserName(nameAdmin);
    setIsAdmin(isAdmin);
    setIsSuperAdmin(false);
    if (commerce) setCommerce(commerce);
    if (businessName) setBusinessName(businessName);
    toast.success("Acesso Autorizado");
  };

  const logout = async () => {
    try {
      await fetch(`${URL_API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
    } finally {
      if (typeof window !== "undefined") {
        document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax; Secure";
      }
      setUserName(null);
      setIsAdmin(false);
      toast.success("Sessão encerrada");
    }
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        login,
        logout,
        businessId,
        businessName,
        commerce,
        isAdmin,
        isSuperAdmin,
        loading,
      }}
    >
      {!loading ? children : <div className="min-h-screen bg-black" />}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}
