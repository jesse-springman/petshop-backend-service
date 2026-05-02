"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import toast from "react-hot-toast";

type UserContextType = {
  userName: string | null;
  login: (name: string, isAdmin: boolean) => void;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const URL_API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        console.log("token no checkUser:", token);

        const response = await fetch(`${URL_API}/auth/me`, {
          credentials: "include",
          headers: token && token !== "null" ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.userName);
          setIsAdmin(data.isAdmin);
        } else {
          setUserName(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.log("nao logado");
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

  const login = (name: string, isAdmin: boolean) => {
    const nameAdmin = name.trim().toLowerCase();
    setUserName(nameAdmin);
    setIsAdmin(isAdmin);
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
    <UserContext.Provider value={{ userName, login, logout, isAdmin, loading }}>
      {!loading ? children : <div className="min-h-screen bg-black" />}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}
