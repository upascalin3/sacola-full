"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/lib/api";

export default function ResetPasswordPageContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [counter, setCounter] = useState(300); // 5 minutes
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  // Get email from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in session, redirect to forgot password
      router.push("/forgot-password");
    }
  }, [router]);

  // Timer countdown
  useEffect(() => {
    if (counter <= 0) return;
    const timer = setInterval(() => setCounter((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const handleOtpChange = (idx: number, value: string) => {
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

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (!email) return setError("Email is required.");
    if (otpCode.length !== 6) return setError("Please enter the 6-digit OTP code.");
    if (!password || !confirmPassword) return setError("Both password fields are required.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    try {
      setIsSubmitting(true);
      setError("");
      
      const response = await AuthApi.resetPasswordWithOtp({ 
        email, 
        otp: otpCode, 
        newPassword: password 
      });
      
      if (response.success) {
        setSuccess(true);
        // Clear session storage
        sessionStorage.removeItem("resetEmail");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(response.message || "Password reset failed");
      }
    } catch (err: any) {
      setError(err?.message || "Password reset failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    try {
      setCounter(300);
      setOtp(["", "", "", "", "", ""]);
      setError("");
      await AuthApi.requestPasswordReset({ email });
    } catch (err: any) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4"
        style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
      >
        <div className="relative w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="text-white w-7 h-7" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 text-base">
                Your password has been successfully updated. You can now login with your new password.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Redirecting to login page...
                </p>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full h-12 bg-gradient-to-r from-[#54D12B] to-[#54D12B] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <Lock className="text-white w-7 h-7" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600 text-base">
              Enter the OTP code sent to <strong>{email}</strong> and your new password.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
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
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-12 h-12 text-center text-lg font-bold border-gray-200 focus:border-[#54D12B] focus:ring-[#54D12B] rounded-lg shadow-sm"
                      autoFocus={idx === 0}
                    />
                  ))}
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
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="h-12 text-base border-gray-200 focus:border-[#54D12B] focus:ring-[#54D12B] pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Minimum 8 characters required</p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="h-12 text-base border-gray-200 focus:border-[#54D12B] focus:ring-[#54D12B] pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-xs text-red-600 mt-1 text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#54D12B] to-[#54D12B] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || counter === 0}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
            <div className="flex flex-col items-center gap-2 mt-4">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-[#54D12B] hover:underline"
                disabled={counter > 0}
              >
                Resend OTP Code
              </button>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-gray-500 hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Forgot Password
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


