"use client";

import { Manrope } from "next/font/google";
import "./globals.css";
import React, { useEffect, useState } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/toast";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased`}
        style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
      >
        {initialLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-[#54D12B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
