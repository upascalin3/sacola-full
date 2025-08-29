"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OtpPageContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [counter, setCounter] = useState(600); // 10 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const {
    userEmail,
    isOtpPending,
    isAuthenticated,
    verifyOtpAndLogin,
    logout,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (counter <= 0) return;
    const timer = setInterval(() => setCounter((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    // If already authenticated with valid JWT, go to dashboard
    if (isAuthenticated) {
      router.replace("/dashboard");
      return;
    }
    // If no pending OTP session or missing email, go back to login
    if (!isOtpPending || !userEmail) {
      router.replace("/");
    }
  }, [isAuthenticated, isOtpPending, userEmail, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit OTP sent to your email.");
      return;
    }
    if (counter === 0) {
      setError("OTP expired. Please go back to login and request a new code.");
      return;
    }
    try {
      setIsSubmitting(true);
      setError("");
      if (!userEmail || !isOtpPending)
        throw new Error("Missing or invalid OTP session");
      await verifyOtpAndLogin(userEmail, code);
      // Success - router will handle redirect to dashboard via useEffect
    } catch (err: any) {
      setError(err?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      // Reset timer and OTP input
      setCounter(600);
      setOtp(["", "", "", "", "", ""]);
      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to{" "}
            <span className="font-semibold">{userEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter the 6-digit code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-[#54D12B] focus:outline-none"
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Time left:{" "}
                <span className="font-semibold text-[#54D12B]">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </span>
              </span>
              {counter === 0 && (
                <span className="text-red-500 font-medium">
                  Expired - request a new code
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || counter === 0}
              className="w-full bg-[#54D12B] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#4BC025] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Verifying..." : "Verify & Continue"}
            </button>

            <div className="text-center">
              <Link href="/">
                <button
                  type="button"
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Back to Login
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
