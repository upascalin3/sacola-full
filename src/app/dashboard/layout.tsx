import type { Metadata } from "next";
import React from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Dashboard | SACOLA",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="bg-[#FAFCF8] min-h-screen">
        <Sidebar />
        {children}
      </div>
    </ProtectedRoute>
  );
}
