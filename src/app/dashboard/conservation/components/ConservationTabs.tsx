"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const conservationTabs = [
  { label: "Tree Planting", href: "/dashboard/conservation" },
  { label: "Water Tanks", href: "/dashboard/conservation/water-tanks" },
  { label: "Bamboo", href: "/dashboard/conservation/bamboo" },
  { label: "EU-funded Project", href: "/dashboard/conservation/eu-pro" },
  { label: "Buffalo Wall", href: "/dashboard/conservation/buffalo-wall" },
  // { label: "Other", href: "/dashboard/conservation/other" },
];

export default function ConservationTabs() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="max-w-7xl mx-auto px-8 pt-7">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Conservation
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto overflow-y-hidden no-scrollbar">
          <div className="flex gap-12 whitespace-nowrap">
            {conservationTabs.map((tab) => {
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`pb-4 px-1 font-medium text-sm transition-colors relative ${
                    isActive
                      ? "text-[#54D12B]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
