"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userEmail: string | null;
  isOtpPending: boolean;
  isAuthInitialized: boolean;
  startLogin: (email: string, password: string) => Promise<void>;
  verifyOtpAndLogin: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token expiration time: 10 hours in milliseconds
const TOKEN_EXPIRATION_TIME = 10 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isOtpPending, setIsOtpPending] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const router = useRouter();
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    const storedOtpPending = localStorage.getItem("isOtpPending");
    const storedLoginTime = localStorage.getItem("loginTime");
    const effectiveToken = storedAccessToken || storedToken;

    if (
      effectiveToken &&
      storedEmail &&
      storedOtpPending !== "true" &&
      storedLoginTime
    ) {
      const loginTime = parseInt(storedLoginTime);
      const currentTime = Date.now();

      // Check if token has expired
      if (currentTime - loginTime < TOKEN_EXPIRATION_TIME) {
        // Token is still valid, restore authentication and set up auto logout
        setToken(effectiveToken);
        setUserEmail(storedEmail);
        setIsAuthenticated(true);
        setIsOtpPending(false);
        setupAutoLogout(loginTime);
      } else {
        // Token has expired, clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("isOtpPending");
        localStorage.removeItem("loginTime");
      }
    } else if (storedEmail && storedOtpPending === "true") {
      // If OTP is pending, restore that state but don't authenticate
      setUserEmail(storedEmail);
      setIsOtpPending(true);
      setIsAuthenticated(false);
      setToken(null);
    } else {
      // Clear any invalid state
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isOtpPending");
      localStorage.removeItem("loginTime");
    }
    // Mark auth check complete so routes can decide accurately
    setIsAuthInitialized(true);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearAutoLogout();
    };
  }, []);

  const startLogin = async (email: string, password: string) => {
    try {
      await AuthApi.login({ email, password });
      setUserEmail(email);
      setIsOtpPending(true);
      setIsAuthenticated(false); // Ensure not authenticated until OTP verified
      setToken(null); // Clear any existing token

      // Store state in localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isOtpPending", "true");
      localStorage.removeItem("token"); // Remove any existing token
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loginTime"); // Remove login time until OTP verified

      // Clear any existing auto logout timeout
      clearAutoLogout();
    } catch (error) {
      // Reset state on login failure
      setUserEmail(null);
      setIsOtpPending(false);
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isOtpPending");
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loginTime");
      clearAutoLogout();
      throw error;
    }
  };

  const verifyOtpAndLogin = async (email: string, otp: string) => {
    try {
      const res = await AuthApi.verifyOtp({ email, otp });
      const accessToken =
        res?.data && (res.data as any).accessToken
          ? (res.data as any).accessToken
          : (res as any)?.accessToken;

      if (!accessToken) {
        throw new Error("Missing access token in response");
      }

      // Set authenticated state
      setToken(accessToken);
      setIsAuthenticated(true);
      setIsOtpPending(false);

      // Store login time for expiration tracking
      const loginTime = Date.now();
      localStorage.setItem("loginTime", loginTime.toString());

      // Store in localStorage under both keys for compatibility
      localStorage.setItem("token", accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("isOtpPending", "false");

      // Request notification permission for session warnings
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "default"
      ) {
        Notification.requestPermission();
      }

      // Set up automatic logout after 10 hours
      setupAutoLogout(loginTime);
    } catch (error) {
      // On OTP verification failure, keep OTP pending state
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loginTime");
      clearAutoLogout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await AuthApi.logout(token);
      }
    } catch {
      // ignore network/logout errors
    } finally {
      // Clear all authentication state
      setIsAuthenticated(false);
      setUserEmail(null);
      setToken(null);
      setIsOtpPending(false);

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isOtpPending");
      localStorage.removeItem("loginTime");

      // Clear auto logout timeout
      clearAutoLogout();

      router.push("/");
    }
  };

  // Function to set up automatic logout
  const setupAutoLogout = (loginTime: number) => {
    // Clear any existing timeouts
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Calculate time until expiration
    const timeUntilExpiration = loginTime + TOKEN_EXPIRATION_TIME - Date.now();

    if (timeUntilExpiration > 0) {
      // Set warning 5 minutes before expiration
      const warningTime = Math.max(0, timeUntilExpiration - 5 * 60 * 1000);
      if (warningTime > 0) {
        warningTimeoutRef.current = setTimeout(() => {
          // Show warning notification
          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("Session Expiring Soon", {
                body: "Your session will expire in 5 minutes. Please save your work and log in again.",
                icon: "/favicon.ico",
              });
            }
          }
          // Also show browser alert as fallback
          alert(
            "⚠️ Your session will expire in 5 minutes. Please save your work and log in again."
          );
        }, warningTime);
      }

      // Set timeout for automatic logout
      logoutTimeoutRef.current = setTimeout(() => {
        logout();
      }, timeUntilExpiration);
    } else {
      // Token already expired, logout immediately
      logout();
    }
  };

  // Function to clear auto logout timeout
  const clearAutoLogout = () => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  };

  // Fixed session window (10 hours from login). No activity-based extension.

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        userEmail,
        isOtpPending,
        isAuthInitialized,
        startLogin,
        verifyOtpAndLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
