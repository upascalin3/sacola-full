"use client";

import Sidebar from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Key,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProfilePageContent() {
  // Feedback state
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Example user data (replace with real data from API or context)
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    avatar: "",
    initials: "JD",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    if (!password || !confirmPassword) {
      setErrorMsg("Both password fields are required.");
      setIsSubmitting(false);
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      setIsSubmitting(false);
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setIsSubmitting(false);
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccessMsg("Password changed successfully!");
    setPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64 py-7 px-10">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Profile Settings
            </h1>
            <p>Manage your account settings and security preferences.</p>
          </div>

          {/* Top Row - Profile Overview and Personal Information */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Overview */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <Card>
                <CardHeader className="text-center pb-2">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-[#54D12B] text-white text-lg">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-center">
                    <Badge className="gap-1 bg-[#54D12B]">
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personal Information */}
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your account information is managed by your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input id="name" value={user.name} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Role
                    </Label>
                    <Input id="role" value={user.role} disabled />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Row - Security Settings (Full Width) */}
          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="text-red-600 text-sm font-medium mb-2">
                      {errorMsg}
                    </div>
                  )}
                  {successMsg && (
                    <div className="text-green-600 text-sm font-medium mb-2">
                      {successMsg}
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter new password"
                          required
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
                      <p className="text-xs text-[#54D12B]">
                        Password must be at least 8 characters long.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
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
                  </div>

                  <Separator />

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Password Requirements
                      </p>
                      <ul className="text-xs text-[#54D12B] space-y-1">
                        <li className="flex items-center gap-2">
                          {password.length >= 8 ? (
                            <Check className="h-3 w-3 text-success" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-[#54D12B]" />
                          )}
                          At least 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                          {password &&
                          confirmPassword &&
                          password === confirmPassword ? (
                            <Check className="h-3 w-3 text-success" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-[#54D12B]" />
                          )}
                          Passwords match
                        </li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !password || !confirmPassword}
                      className="min-w-[120px] bg-[#54D12B] text-white md:self-end"
                    >
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
