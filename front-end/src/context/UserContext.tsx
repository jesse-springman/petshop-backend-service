'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';

type UserContextType = {
  userName: string | null;
  login: (name: string) => void;
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
        const response = await fetch(`${URL_API}/auth/me`, {
          credentials: 'include',
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
        console.log('nao logado');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [URL_API]);

  const login = (name: string) => {
    const nameAdmin = name.trim().toLowerCase();
    setUserName(nameAdmin);
    setIsAdmin(true);
    toast.success('Acesso Autorizado');
  };

  const logout = async () => {
    try {
      await fetch(`${URL_API}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
    } finally {
      setUserName(null);
      setIsAdmin(false);
      toast.success('Sessão encerrada');
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
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
