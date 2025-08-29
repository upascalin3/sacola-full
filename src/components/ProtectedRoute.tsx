"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isOtpPending, userEmail, isAuthInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthInitialized) return; // wait for auth to initialize to avoid premature redirects
    if (!isAuthenticated) {
      // If not authenticated but OTP is pending, go to OTP page
      if (isOtpPending && userEmail) {
        router.push("/otp");
      } else {
        // Otherwise go to login
        router.push("/");
      }
    }
  }, [isAuthenticated, isOtpPending, userEmail, isAuthInitialized, router]);

  // Show loading or nothing while checking authentication
  if (!isAuthInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="w-12 h-12 border-4 border-[#54D12B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
