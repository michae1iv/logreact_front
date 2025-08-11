'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { decodeSessToken } from '@/utils/auth';

interface AuthContextType {
  username: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const payload = decodeSessToken();
    if (payload && payload.username) {
      setUsername(payload.username);
    }
  }, []);

  const login = () => {
    const payload = decodeSessToken();
    if (payload && payload.username) {
      setUsername(payload.username);
    }
  };

  const logout = () => {
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};