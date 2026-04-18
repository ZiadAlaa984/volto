import { clsx, type ClassValue } from "clsx";
import { sileo } from "sileo";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type ToastType = "success" | "error" | "info" | "warning" | "promise";
type CallableToastType = Exclude<ToastType, "promise">; // ← remove promise

type ToastProps = {
  title: string;
  description?: string;
  variant?: CallableToastType; // ← use this here
  isLoading?: boolean;
};

export function toastShared({
  title,
  description,
  variant = "success",
  isLoading = false,
}: ToastProps) {
  const options = {
    title,
    description,
    fill: "fff/50",
    styles: {
      title: "text-white!",
      description: "text-white/80!",
    },
  };

  if (isLoading) {
    sileo.show({
      ...options,
      styles: {
        title: "text-white!",
        description: "text-white/75!",
      },
    });
  } else {
    (sileo[variant] as (opts: typeof options) => void)(options); // ← cast to known signature
  }
}

// lib/catchAsync.ts

export function catchAsync<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options?: {
    onError?: (err: Error) => void;
    title?: string;
    description?: string;
  },
) {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Please try again.");

      toastShared({
        title: options?.title ?? "Something went wrong",
        description: options?.description ?? error.message,
        variant: "error",
      });

      options?.onError?.(error);
      return undefined;
    }
  };
}




// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getErrorMessage(error: Error): string {
  return error.message.includes("cards_user_id_key")
    ? "You already have a card"
    : "Failed to create card";
}

export function errorToast(error: Error) {
  toastShared({
    title: "Something went wrong",
    description: getErrorMessage(error),
    variant: "error",
  });
}


export const SLUG_REGEX = /[^a-z0-9-]/g;

export function sanitizeSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(SLUG_REGEX, "");
}

// export function getOrigin() {
//   return typeof window !== "undefined" ? window.location.origin : "";
// }


export function formatDate(value: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (isNaN(date.getTime())) return value          // plain text → show as-is
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const formatFileName = (name: string) => {
  const ext = name.split('.').pop(); // get extension (jpg)
  const base = name.slice(0, 5);     // first 5 chars
  return `${base}... .${ext}`;
};