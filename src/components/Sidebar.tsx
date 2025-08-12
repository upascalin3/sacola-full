"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Leaf, Users, FileText, User, LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Conservation", href: "/dashboard/conservation", icon: Leaf },
  { label: "Socio-Economic", href: "/dashboard/socio-economic", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white px-6 py-8 flex flex-col justify-between z-30 border-r border-gray-100">
      <div>
        <div className="mb-8 text-xl font-semibold tracking-wide text-gray-900">
          SACOLA
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Fixed logic: exact match for /dashboard, startsWith for sub-routes
            const isActive = item.href === "/dashboard" 
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
      <button className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#54D12B] text-white font-medium text-sm hover:bg-[#43b71f] transition-colors">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}