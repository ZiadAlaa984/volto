import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Outfit, Geist_Mono } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { ToasterClient } from "@/components/ToasterClient";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider>
              <QueryProvider>
                <ToasterClient />
                {children}
              </QueryProvider>
            </AuthProvider>
          </Suspense>

        </ThemeProvider>
      </body>
    </html>
  );
}
