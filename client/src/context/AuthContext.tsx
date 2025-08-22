import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetInactivityTimer: () => void;
  showInactivityWarning: boolean;
  dismissInactivityWarning: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_KEY = 'auth_state_v1';
const MAGIC_PASSWORD = 'M22m$LOVINGGOD';
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const WARNING_TIMEOUT = 9 * 60 * 1000; // Show warning at 9 minutes (1 minute before logout)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showInactivityWarning, setShowInactivityWarning] = useState<boolean>(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to dismiss the inactivity warning
  const dismissInactivityWarning = useCallback(() => {
    setShowInactivityWarning(false);
    resetInactivityTimer();
  }, []);

  // Function to reset the inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    
    if (isAuthenticated) {
      // Set warning timer (9 minutes)
      warningTimerRef.current = setTimeout(() => {
        setShowInactivityWarning(true);
      }, WARNING_TIMEOUT);
      
      // Set logout timer (10 minutes)
      inactivityTimerRef.current = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [isAuthenticated]);

  // Function to handle logout
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername(null);
    setShowInactivityWarning(false);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
  }, []);

  // Set up activity listeners when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Reset timer on user activity
      const handleActivity = () => {
        if (showInactivityWarning) {
          setShowInactivityWarning(false);
        }
        resetInactivityTimer();
      };

      // Add event listeners for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      // Start the initial timer
      resetInactivityTimer();

      // Cleanup function
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        if (warningTimerRef.current) {
          clearTimeout(warningTimerRef.current);
        }
      };
    }
  }, [isAuthenticated, resetInactivityTimer, showInactivityWarning]);

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

  const value = useMemo(
    () => ({ 
      isAuthenticated, 
      username, 
      login, 
      logout, 
      resetInactivityTimer, 
      showInactivityWarning, 
      dismissInactivityWarning 
    }),
    [isAuthenticated, username, login, logout, resetInactivityTimer, showInactivityWarning, dismissInactivityWarning]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


