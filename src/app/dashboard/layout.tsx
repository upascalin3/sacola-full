"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProtectedRoute>
      <div className="bg-[#FAFCF8] min-h-screen">
        <Sidebar />
        {loading ? (
          <div className="ml-64 flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-[#54D12B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </ProtectedRoute>
  );
}
