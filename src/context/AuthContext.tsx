// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";

interface LoginPayload {
  token: string;
  role: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => void;
  logout: () => void;
  token: string | null;
  role: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  useEffect(() => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
    if (token) localStorage.setItem("token", token);
    if (role) localStorage.setItem("role", role);
  }, [isAuthenticated, token, role]);

  const login = ({ token, role }: LoginPayload) => {
    setIsAuthenticated(true);
    setToken(token);
    setRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setRole(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, token, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
