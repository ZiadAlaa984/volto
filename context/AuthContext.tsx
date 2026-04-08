"use client";

import {
  createContext, useContext, useEffect,
  useState, useCallback, ReactNode,
} from "react";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setStatus(session ? "authenticated" : "unauthenticated");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!session || event === "SIGNED_OUT") {
          setSession(null);
          setStatus("unauthenticated");
          return;
        }

        if (event === "TOKEN_REFRESHED") {
          setSession(session);
          return;
        }

        // ✅ Defer everything outside the lock
        if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("deleted_at")
              .eq("id", session.user.id)
              .single();

            if (profile?.deleted_at) {
              setSession(null);
              setStatus("unauthenticated");
              router.replace("/auth/account-deleted");
              await supabase.auth.signOut(); // ✅ safe now — outside the lock
              return;
            }

            setSession(session);
            setStatus("authenticated");
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setStatus("unauthenticated");
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