"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuthApi } from "@/lib/api";

export default function ResetPasswordPageContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Email is required.");
    if (!token) return setError("Reset token is required.");
    if (!password || !confirmPassword) return setError("Both fields are required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    try {
      setIsSubmitting(true);
      await AuthApi.resetPassword({ email, token, otp: "", newPassword: password, confirmNewPassword: confirmPassword });
      setError("");
      setSuccess(true);
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Reset failed");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Enter your new password below.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="h-12 text-base border-gray-200 focus:border-[#54D12B] focus:ring-[#54D12B]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token" className="text-sm font-medium text-gray-700">Reset Token</Label>
                <Input id="token" type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste the reset token" className="h-12 text-base border-gray-200 focus:border-[#54D12B] focus:ring-[#54D12B]" />
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
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
              {success && (
                <p className="text-xs text-green-600 mt-1 text-center">
                  Password reset successful! Redirecting to login...
                </p>
              )}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#54D12B] to-[#54D12B] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || success}
              >
                {isSubmitting
                  ? "Resetting..."
                  : success
                  ? "Success!"
                  : "Reset Password"}
              </Button>
            </form>
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
