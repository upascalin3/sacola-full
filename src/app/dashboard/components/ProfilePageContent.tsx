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
import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Shield,
  Key,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UsersApi, UserProfile, ChangePasswordDto } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function ProfilePageContent() {
  const { token, logout } = useAuth();
  const { addToast } = useToast();
  const mountedRef = useRef(true);

  // Feedback state
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // User profile state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add User state
  const [newUserData, setNewUserData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "user" as "user" | "viewer",
  });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Delete Account state
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Track mount status
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        if (!mountedRef.current) return;
        setProfileError("No authentication token available");
        setIsLoadingProfile(false);
        return;
      }

      try {
        if (!mountedRef.current) return;
        setIsLoadingProfile(true);
        setProfileError("");
        const response = await UsersApi.me(token);

        if (!mountedRef.current) return;
        if (response.success && response.data) {
          setUser(response.data as UserProfile);
          addToast({
            type: "success",
            title: "Profile loaded",
            message: "Your profile details are up to date.",
          });
        } else {
          setProfileError(response.message || "Failed to fetch profile");
        }
      } catch (error: any) {
        if (!mountedRef.current) return;
        setProfileError(error.message || "Failed to fetch profile");
        addToast({
          type: "error",
          title: "Failed to load profile",
          message: error.message || "Could not fetch your profile details.",
        });
      } finally {
        if (!mountedRef.current) return;
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg("All password fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      setErrorMsg("No authentication token available.");
      setIsSubmitting(false);
      return;
    }

    try {
      const passwordData: ChangePasswordDto = {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      };

      const response = await UsersApi.changeMyPassword(token, passwordData);

      if (response.success) {
        setSuccessMsg("Password changed successfully!");
        addToast({
          type: "success",
          title: "Password Updated",
          message: "Your password has been changed successfully.",
        });
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMsg(response.message || "Failed to change password");
        addToast({
          type: "error",
          title: "Update Failed",
          message: response.message || "Could not change your password.",
        });
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to change password");
      addToast({
        type: "error",
        title: "Update Failed",
        message: error.message || "Could not change your password.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingUser(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (!newUserData.email || !newUserData.password) {
      setErrorMsg("Email and password are required.");
      setIsAddingUser(false);
      return;
    }

    if (newUserData.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      setIsAddingUser(false);
      return;
    }

    if (!token) {
      setErrorMsg("No authentication token available.");
      setIsAddingUser(false);
      return;
    }

    try {
      const response = await UsersApi.register(newUserData);

      if (response.success) {
        setSuccessMsg("User created successfully!");
        addToast({
          type: "success",
          title: "User Created",
          message: "The user has been created successfully.",
        });
        // Clear form and close modal
        setNewUserData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "user" as "user" | "viewer",
        });
        setShowAddUserModal(false);
      } else {
        setErrorMsg(response.message || "Failed to create user");
        addToast({
          type: "error",
          title: "Creation Failed",
          message: response.message || "Could not create the user.",
        });
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to create user");
      addToast({
        type: "error",
        title: "Creation Failed",
        message: error.message || "Could not create the user.",
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!deletePassword) {
      setErrorMsg("Please enter your password to confirm account deletion.");
      return;
    }

    if (deletePassword.trim().length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    // Show confirmation modal instead of immediately deleting
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setShowDeleteConfirmModal(false);
    setErrorMsg("");
    setSuccessMsg("");

    if (!token) {
      setErrorMsg("No authentication token available.");
      setIsDeletingAccount(false);
      return;
    }

    try {
      const response = await UsersApi.deleteAccount(token, {
        password: deletePassword,
      });

      if (response.success) {
        if (mountedRef.current) {
          setSuccessMsg(
            (response as any).message || "Account deleted successfully!"
          );
          addToast({
            type: "success",
            title: "Account Deleted",
            message: (response as any).message || "Your account was deleted.",
          });
          setDeletePassword("");
        }
        // Immediately logout to avoid further renders/state updates on this page
        logout();
      } else {
        setErrorMsg(response.message || "Failed to delete account");
        addToast({
          type: "error",
          title: "Deletion Failed",
          message: response.message || "Could not delete your account.",
        });
      }
    } catch (error: any) {
      // Handle specific error cases with appropriate messages
      const errorMessage = error.message || "Failed to delete account";
      const statusCode = error.status || error.response?.status;

      if (
        statusCode === 404 ||
        errorMessage.toLowerCase().includes("not found") ||
        errorMessage.toLowerCase().includes("user not found")
      ) {
        if (mountedRef.current) {
          setErrorMsg("Email address is not registered in our system.");
          addToast({
            type: "error",
            title: "Deletion Failed",
            message: "Email address is not registered in our system.",
          });
        }
      } else if (
        statusCode === 401 ||
        errorMessage.toLowerCase().includes("unauthorized") ||
        errorMessage.toLowerCase().includes("invalid password") ||
        errorMessage.toLowerCase().includes("incorrect password")
      ) {
        if (mountedRef.current) {
          setErrorMsg(
            "Incorrect password. Please verify your password and try again."
          );
          addToast({
            type: "error",
            title: "Incorrect Password",
            message: "Please verify your password and try again.",
          });
        }
      } else if (
        statusCode === 403 ||
        errorMessage.toLowerCase().includes("forbidden")
      ) {
        if (mountedRef.current) {
          setErrorMsg("You do not have permission to delete this account.");
          addToast({
            type: "error",
            title: "Forbidden",
            message: "You do not have permission to delete this account.",
          });
        }
      } else {
        if (mountedRef.current) {
          setErrorMsg(errorMessage);
          addToast({
            type: "error",
            title: "Deletion Failed",
            message: errorMessage,
          });
        }
      }
    } finally {
      if (mountedRef.current) setIsDeletingAccount(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirmModal(false);
    setDeletePassword("");
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Loading state for profile
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-64 py-7 px-10">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading profile...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state for profile
  if (profileError) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-64 py-7 px-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load profile
              </h3>
              <p className="text-gray-600 mb-4">{profileError}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#54D12B] text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-64 py-7 px-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No profile data</h3>
              <p className="text-gray-600">
                Unable to load user profile information.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Generate initials from full name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64 py-7 px-10">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Profile Settings
                </h1>
                <p>Manage your account settings and security preferences.</p>
              </div>
              {user && user.role?.toLowerCase() !== "viewer" && (
                <Button
                  onClick={() => setShowAddUserModal(!showAddUserModal)}
                  className="bg-[#54D12B] text-white hover:bg-[#45B824]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showAddUserModal ? "Hide Form" : "Add New User"}
                </Button>
              )}
            </div>
          </div>

          {/* Top Row - Profile Overview and Personal Information */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Overview */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <Card>
                <CardHeader className="text-center pb-2">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[#54D12B] text-white text-lg">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{user.fullName}</CardTitle>
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
                      <Input id="name" value={user.fullName} disabled />
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

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="text-sm font-medium"
                      >
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
                          tabIndex={-1}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="text-sm font-medium"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
                          tabIndex={-1}
                        >
                          {showNewPassword ? (
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
                          {newPassword.length >= 8 ? (
                            <Check className="h-3 w-3 text-success" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-[#54D12B]" />
                          )}
                          At least 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                          {newPassword &&
                          confirmPassword &&
                          newPassword === confirmPassword ? (
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
                      disabled={
                        isSubmitting ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword
                      }
                      className="min-w-[120px] bg-[#54D12B] text-white md:self-end"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Delete Account Section */}
          <div className="w-full">
            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-red-800 text-xl font-bold">
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-700 font-medium">
                      Permanently delete your account
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-red-200 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-red-800 font-semibold text-sm">
                        This action cannot be undone
                      </p>
                      <p className="text-red-700 text-sm">
                        This will permanently delete your account, profile
                        information, and lose access to the system.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleDeleteAccount} className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="deletePassword"
                      className="text-sm font-bold text-red-800 flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Confirm with your password
                    </Label>
                    <div className="relative">
                      <Input
                        id="deletePassword"
                        type={showDeletePassword ? "text" : "password"}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your current password"
                        required
                        className="h-12 border-2 border-red-300 focus:border-red-500 focus:ring-red-500 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-red-400"
                        disabled={isDeletingAccount}
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-100 transition-all duration-200 disabled:opacity-50"
                        tabIndex={-1}
                        disabled={isDeletingAccount}
                      >
                        {showDeletePassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="flex-1">
                      <p className="text-xs text-red-600 mb-2">
                        Type your password and click the button below to proceed
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={isDeletingAccount || !deletePassword.trim()}
                      className="min-w-[180px] h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isDeletingAccount ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Deleting Account...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-5 w-5 mr-2" />
                          Delete My Account
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddUserModal(false)}
          />
          <div className="relative h-full flex items-start justify-center pt-20">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add New User
                  </h2>
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddUser} className="space-y-6">
                  {errorMsg && (
                    <div className="text-red-600 text-sm font-medium p-3 bg-red-50 border border-red-200 rounded-md">
                      {errorMsg}
                    </div>
                  )}
                  {successMsg && (
                    <div className="text-green-600 text-sm font-medium p-3 bg-green-50 border border-green-200 rounded-md">
                      {successMsg}
                    </div>
                  )}

                  {/* Two-column grid layout */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="newUserEmail"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="newUserEmail"
                          type="email"
                          value={newUserData.email}
                          onChange={(e) =>
                            setNewUserData({
                              ...newUserData,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter email address"
                          required
                          className="w-full border-gray-300 focus:border-[#54D12B] focus:ring-[#54D12B]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="newUserPassword"
                          className="text-sm font-medium text-gray-700"
                        >
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="newUserPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newUserData.password}
                            onChange={(e) =>
                              setNewUserData({
                                ...newUserData,
                                password: e.target.value,
                              })
                            }
                            placeholder="Enter password"
                            required
                            className="w-full border-gray-300 focus:border-[#54D12B] focus:ring-[#54D12B] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Minimum 8 characters required
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="newUserFirstName"
                          className="text-sm font-medium text-gray-700"
                        >
                          First Name
                        </Label>
                        <Input
                          id="newUserFirstName"
                          type="text"
                          value={newUserData.firstName}
                          onChange={(e) =>
                            setNewUserData({
                              ...newUserData,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Enter first name"
                          className="w-full border-gray-300 focus:border-[#54D12B] focus:ring-[#54D12B]"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="newUserLastName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="newUserLastName"
                          type="text"
                          value={newUserData.lastName}
                          onChange={(e) =>
                            setNewUserData({
                              ...newUserData,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Enter last name"
                          className="w-full border-gray-300 focus:border-[#54D12B] focus:ring-[#54D12B]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="newUserRole"
                          className="text-sm font-medium text-gray-700"
                        >
                          User Role <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="newUserRole"
                          value={newUserData.role}
                          onChange={(e) =>
                            setNewUserData({
                              ...newUserData,
                              role: e.target.value as "user" | "viewer",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:border-[#54D12B] bg-white"
                        >
                          <option value="user">
                            User - Full Access (Create, Edit, Delete)
                          </option>
                          <option value="viewer">
                            Viewer - Read Only Access
                          </option>
                        </select>
                        <p className="text-xs text-gray-500">
                          Select the appropriate role for this user based on
                          their responsibilities.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddUserModal(false)}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isAddingUser ||
                        !newUserData.email ||
                        !newUserData.password
                      }
                      className="px-6 py-2 bg-[#54D12B] text-white hover:bg-[#45B824]"
                    >
                      {isAddingUser ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-200 p-8 w-full max-w-lg mx-4 transform animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
                  <Trash2 className="text-red-600 w-10 h-10" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-white w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Delete Account Forever?
              </h2>
              <p className="text-gray-700 text-base mb-4">
                You're about to permanently delete your account. This action
                cannot be undone and will immediately remove all your data.
              </p>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-red-400 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-red-800 font-bold text-sm mb-2">
                      What will be deleted:
                    </p>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>✗ Your profile and personal information</li>
                      <li>✗ Account settings and preferences</li>
                      <li>✗ Access to the system</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <p className="text-amber-800 text-sm font-medium">
                  💡 Consider exporting your data before deletion if needed
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={cancelDeleteAccount}
                variant="outline"
                className="flex-1 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium"
                disabled={isDeletingAccount}
              >
                <span className="mr-2">←</span>
                Keep My Account
              </Button>
              <Button
                onClick={confirmDeleteAccount}
                className="flex-1 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Deleting Forever...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5 mr-2" />
                    Yes, Delete Forever
                  </>
                )}
              </Button>
            </div>

            {!isDeletingAccount && (
              <p className="text-center text-xs text-gray-500 mt-4">
                This action is permanent and cannot be reversed
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
