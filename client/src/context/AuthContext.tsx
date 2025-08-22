import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_KEY = 'auth_state_v1';
const MAGIC_PASSWORD = 'M22m$LOVINGGOD';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { isAuthenticated: boolean; username: string | null };
        setIsAuthenticated(!!parsed.isAuthenticated);
        setUsername(parsed.username ?? null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ isAuthenticated, username })
      );
    } catch {}
  }, [isAuthenticated, username]);

  const login = useCallback(async (user: string, password: string) => {
    if (password === MAGIC_PASSWORD) {
      setIsAuthenticated(true);
      setUsername(user || 'user');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, username, login, logout }),
    [isAuthenticated, username, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


