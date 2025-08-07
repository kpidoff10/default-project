"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  SessionProvider,
  SignOutParams,
  signOut,
  useSession,
} from "next-auth/react";

import SplashScreen from "@/components/ui/splash-screen";
import { User } from "next-auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | undefined;
  isAdmin: boolean;
  isCreator: boolean;
  signOut: (options?: SignOutParams) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [showSplash, setShowSplash] = useState(true);

  const isAuthenticated = !!session;
  const isLoading = status === "loading";
  const user = session?.user || null;
  const userRole = session?.user?.role as string | undefined;

  const isAdmin = userRole === "admin";
  const isCreator = userRole === "creator" || isAdmin;

  // Gérer l'affichage du splash screen avec un délai minimum de 2 secondes
  useEffect(() => {
    if (isLoading) {
      setShowSplash(true);
    } else {
      // Attendre au moins 2 secondes avant de masquer le splash
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Afficher le splash screen si on charge OU si on doit encore l'afficher
  if (isLoading || showSplash) {
    return <SplashScreen />;
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    userRole,
    isAdmin,
    isCreator,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
