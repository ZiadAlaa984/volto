import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { fontSans, fontMono, cairo } from "@/lib/fonts";
import { ToasterClient } from "@/components/ToasterClient";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";
import QueryProvider from "@/providers/QueryProvider";
import Loading from "./loading";
import { TooltipProvider } from "@/components/ui/tooltip"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Volto",
  description: "Volto — One link Everything you are",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} ${cairo.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>
            <AuthProvider>
              <QueryProvider>
                <ToasterClient />
                <TooltipProvider>{children}</TooltipProvider>
                <Analytics />
              </QueryProvider>
            </AuthProvider>
          </Suspense>

        </ThemeProvider>
      </body>
    </html>
  );
}
