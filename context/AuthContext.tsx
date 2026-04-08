"use client";

import {
  createContext, useContext, useEffect,
  useState, useCallback, useRef, ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const router = useRouter();

  // ✅ store router in a ref so checkDeletedAndHandle never needs
  //    to re-create when router changes between renders
  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; }, [router]);

  // ✅ stable — no deps that change, uses routerRef instead of router directly
  const checkDeletedAndHandle = useCallback(async (session: Session) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("deleted_at")
      .eq("id", session.user.id)
      .single();

    if (profile?.deleted_at) {
      await supabase.auth.signOut();
      setSession(null);
      setStatus("unauthenticated");
      routerRef.current.replace("/auth/account-deleted"); // 👈 ref, not closure
      return;
    }

    setSession(session);
    setStatus("authenticated");
  }, []); // ✅ empty deps — this never recreates

  // ✅ empty deps — subscribes once on mount, never re-subscribes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session || event === "SIGNED_OUT") {
          setSession(null);
          setStatus("unauthenticated");
          return;
        }

        if (event === "TOKEN_REFRESHED") {
          setSession(session);
          return;
        }

        if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
          await checkDeletedAndHandle(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // ✅ safe now because checkDeletedAndHandle is stable

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const SignInProvider = useCallback(async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({ provider });
  }, []);

  return (
    <AuthContext.Provider value={{
      SignInProvider,
      session,
      user: session?.user ?? null,
      status,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}