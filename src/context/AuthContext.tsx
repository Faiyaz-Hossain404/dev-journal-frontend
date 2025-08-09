import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

type User = { id: string; name: string; email: string } | null;

type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await apiFetch("/api/auth/me", { auth: true });
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("auth:logout"));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

//custom hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
