"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  Leaf,
  Users,
  BarChart2,
  User,
  LogOut,
  Clock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Conservation", href: "/dashboard/conservation", icon: Leaf },
  { label: "Socio-Economic", href: "/dashboard/socio-economic", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, userEmail } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // Calculate time remaining in session
  useEffect(() => {
    const updateTimeRemaining = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        const expirationTime = loginTimestamp + 10 * 60 * 60 * 1000; // 10 hours
        const remaining = expirationTime - currentTime;

        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor(
            (remaining % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          const paddedSeconds = String(seconds).padStart(2, "0");
          setTimeRemaining(`${hours}h ${minutes}m ${paddedSeconds}s`);
        } else {
          setTimeRemaining("Expired");
        }
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white px-6 py-8 flex flex-col justify-between z-30 border-r border-gray-100">
      <div>
        <div className="mb-8 text-xl font-bold tracking-wide text-gray-900">
          SACOLA
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-[#EBF2EB] text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} className="text-gray-600" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-0">
        {/* Session Info */}
        <div className="flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-lg">
          <Clock size={16} className="text-gray-500" />
          <span className="text-xs text-gray-600">
            Session: {timeRemaining}
          </span>
        </div>

        {/* User Email */}
        {userEmail && (
          <div className="px-4 py-1 text-xs text-gray-500 truncate">
            {userEmail}
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-white font-medium text-sm transition-colors ${
            isLoggingOut
              ? "bg-[#7FD65F] cursor-not-allowed opacity-80"
              : "bg-[#54D12B] hover:bg-[#43b71f]"
          }`}
        >
          <LogOut size={18} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
