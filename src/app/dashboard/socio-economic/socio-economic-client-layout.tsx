"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function SocioEconomicClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#FAFCF8] min-h-screen">
      <Sidebar />
      {showSkeleton ? (
        <main className="ml-64 py-7 px-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      ) : (
        children
      )}
    </div>
  );
}
