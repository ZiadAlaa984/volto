"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import Router from "@/lib/route";
import { useAuth } from "@/context/AuthContext";

export function AuthButton() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-9 w-40 rounded-md bg-muted animate-pulse" />; // skeleton
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href={Router.DASHBOARD}>Dashboard</Link>
        </Button>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}