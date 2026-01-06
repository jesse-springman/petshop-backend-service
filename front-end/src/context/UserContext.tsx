'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
  isAdmin: boolean | undefined;
};

const admins = process.env.ADMINS;

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(() => {
    //carrega localStorage ao iniciar
    if (typeof window !== 'undefined') {
      return localStorage.getItem('petshop_user');
    }
    return null;
  });

  const login = (name: string) => {
    const trimed = name.trim().toLowerCase();

    if (trimed) {
      setUserName(trimed);
      localStorage.setItem('petshop_user', trimed);

      localStorage.setItem(
        'is_admin',
        admins?.includes(trimed) ? 'true' : 'false',
      );
    }
  };

  const isAdmin = admins?.includes(userName?.toLowerCase() || '');

  const logout = () => {
    setUserName(null);
    localStorage.removeItem('petshop_user');
  };

  return (
    <UserContext.Provider value={{ userName, login, logout, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
