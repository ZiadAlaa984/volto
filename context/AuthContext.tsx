"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

// ── Types ────────────────────────────────────────────────────────────────────
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  status: AuthStatus;
  isLoading: boolean;
  SignInProvider: (provider: "google" | "github") => Promise<void>;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
};

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    // 1. Hydrate session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setStatus(session ? "authenticated" : "unauthenticated");
    });

    // 2. Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setStatus(session ? "authenticated" : "unauthenticated");

        // Optional: handle specific events
        if (event === "SIGNED_OUT") setSession(null);
        if (event === "TOKEN_REFRESHED") console.log("Token refreshed");
      }
    );

    // 3. Cleanup listener on unmount
    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setStatus("unauthenticated");
  }, []);


  const SignInProvider = useCallback(async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
    });
  }, []);


  return (
    <AuthContext.Provider
      value={{
        SignInProvider,
        session,
        user: session?.user ?? null,
        status,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Raw context export (for useAuth) ─────────────────────────────────────────
export { AuthContext };
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}