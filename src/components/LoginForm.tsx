"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { FieldError } from "@/components/ui/error-display";
import { useToast } from "@/components/ui/toast";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/lib/error-handling";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [forgotLoading, setForgotLoading] = useState(false);
  const { startLogin } = useAuth();
  const { addToast } = useToast();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };

    // Validate email
    const emailError = validateRequired(email, "Email") || validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Validate password
    const passwordError =
      validateRequired(password, "Password") || validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await startLogin(email, password);
      addToast({
        type: "success",
        title: "Login Successful",
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      });
      // Redirect after showing success toast
      setTimeout(() => {
        router.push("/otp");
      }, 1500);
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Login Failed",
        message: err?.message || ERROR_MESSAGES.LOGIN_FAILED,
      });
      setErrors((prev) => ({
        ...prev,
        password: err?.message || ERROR_MESSAGES.LOGIN_FAILED,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4"
      style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-50 opacity-40 pointer-events-none"></div>
      {forgotLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="w-12 h-12 border-4 border-[#54D12B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="relative w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6 pt-8 px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sign In To Your Account
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Enter your credentials to continue
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-[#54D12B] transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="Enter your email"
                    className={`pl-12 pr-4 h-14 border-2 rounded-2xl bg-gray-50/50 font-medium placeholder:text-gray-400 focus:bg-white transition-all duration-200 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#54D12B] focus:ring-[#54D12B]/10 focus:ring-4"
                    }`}
                  />
                </div>
                <FieldError error={errors.email} />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-[#54D12B] transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="Enter your password"
                    className={`pl-12 pr-14 h-14 border-2 rounded-2xl bg-gray-50/50 font-medium placeholder:text-gray-400 focus:bg-white transition-all duration-200 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#54D12B] focus:ring-[#54D12B]/10 focus:ring-4"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FieldError error={errors.password} />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded-lg border-2 border-gray-300 text-white transition-all duration-200"
                  />
                  <span className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-[#54D12B] hover:text-[#54D12B] font-semibold transition-colors duration-200 hover:underline underline-offset-2"
                  onClick={() => {
                    setForgotLoading(true);
                    router.push("/forgot-password");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-[#54D12B] via-[#54D12B] to-[#54D12B] hover:from-[#54D12B] hover:via-[#54D12B] hover:to-[#54D12B] text-white font-bold rounded-2xl shadow-xl shadow-[#54D12B]/25 hover:shadow-2xl hover:shadow-[#54D12B]/30 transform hover:scale-102 active:scale-98 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} SACOLA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
