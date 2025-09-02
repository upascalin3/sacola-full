"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function ForgotPasswordPageContent() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await AuthApi.requestPasswordReset({ email });

      if (response.success) {
        setSuccess(true);
        // Store email in sessionStorage for the next step
        sessionStorage.setItem("resetEmail", email);
        addToast({
          type: "success",
          title: "Reset code sent",
          message: "Please check your email for the reset code.",
        });
      } else {
        // Handle specific error cases
        const errorMessage = response.message || "Failed to send reset code";
        if (
          errorMessage.toLowerCase().includes("not found") ||
          errorMessage.toLowerCase().includes("not registered") ||
          errorMessage.toLowerCase().includes("does not exist")
        ) {
          setError(
            "This email address is not registered. Please check your email or create an account."
          );
        } else {
          setError(errorMessage);
        }
        addToast({
          type: "error",
          title: "Could not send reset code",
          message: errorMessage,
        });
      }
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Request failed",
        message: err?.message || "Failed to send reset code.",
      });

      // Handle specific HTTP status codes
      if (err?.status === 404 || err?.statusCode === 404) {
        setError(
          "This email address is not registered. Please check your email or create an account."
        );
      } else if (err?.status === 400 || err?.statusCode === 400) {
        setError(
          err?.message || "Invalid email address. Please check and try again."
        );
      } else if (err?.status === 429 || err?.statusCode === 429) {
        setError(
          "Too many requests. Please wait a few minutes before trying again."
        );
      } else if (err?.status >= 500 || err?.statusCode >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          err?.message ||
            "Failed to send reset code. Please check your email and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToReset = () => {
    router.push("/reset-password");
  };

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
                  <Mail className="text-white w-7 h-7" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 text-base">
                We've sent a password reset code to <strong>{email}</strong>
              </p>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Please check your email and click the button below to continue
                  with the password reset process.
                </p>
                <Button
                  onClick={handleContinueToReset}
                  className="w-full h-12 bg-gradient-to-r from-[#54D12B] to-[#54D12B] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Continue to Reset Password
                </Button>
              </div>
              <div className="flex flex-col items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-sm text-[#54D12B] hover:underline"
                >
                  Try Different Email
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Back to Login
                </button>
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
                <Mail className="text-white w-7 h-7" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password
            </h2>
            <p className="text-gray-600 text-base">
              Enter your email address and we'll send you a code to reset your
              password.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 text-base border-gray-200 focus:border-[#54D12B] focus:ring-[#54D12B]"
                  required
                />
                {error && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <div className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0">
                      ⚠️
                    </div>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#54D12B] to-[#54D12B] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
            <div className="flex flex-col items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-sm text-gray-500 hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
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
