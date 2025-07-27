"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MailCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function OtpPageContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [counter, setCounter] = useState(300); // 5 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { userEmail, logout } = useAuth();

  useEffect(() => {
    if (counter <= 0) return;
    const timer = setInterval(() => setCounter((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const handleChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
    if (!value && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Integration: verify OTP here
      if (otp.join("").length !== 6) {
        setError("Please enter the 6-digit OTP sent to your email.");
      } else {
        setError("");
        // Success: redirect or show success message
      }
    }, 1000);
  };

  const handleResend = () => {
    setCounter(300);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    // Optionally, trigger resend OTP API here
  };

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4"
      style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
    >
      <div className="relative w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-[#54D12B] rounded-2xl flex items-center justify-center shadow-lg">
                <MailCheck className="text-white w-7 h-7" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify OTP
            </h2>
            <p className="text-gray-600 text-base">
              An OTP has been sent to{" "}
              <span className="font-semibold text-[#54D12B]">{userEmail}</span>.
              Please enter it below.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="otp"
                  className="text-sm font-medium text-gray-700"
                >
                  OTP Code
                </Label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, idx) => (
                    <Input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                        return undefined;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      className="w-12 h-12 text-center text-lg font-bold border-gray-200 focus:border-[#54D12B] focus:ring-[#54D12B] rounded-lg shadow-sm"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-xs text-red-600 mt-1 text-center">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Time left:{" "}
                  <span className="font-semibold text-[#54D12B]">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                </span>
                {counter === 0 && (
                  <span className="text-red-500 font-medium">Expired</span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#54D12B] to-[#54D12B] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || counter === 0}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>
            </form>
            <div className="flex flex-col items-center gap-2 mt-4">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-[#54D12B] hover:underline"
              >
                Send Code Again
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-sm text-gray-500 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} SACOLA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
