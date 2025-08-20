"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const socioEconomicTabs = [
  { label: "Livestock", href: "/dashboard/socio-economic" },
  { label: "Housing", href: "/dashboard/socio-economic/housing" },
  { label: "Empowerment", href: "/dashboard/socio-economic/empowerment" },
  { label: "Education", href: "/dashboard/socio-economic/education" },
  { label: "Health Centres", href: "/dashboard/socio-economic/health-centres" },
  { label: "IT Centre", href: "/dashboard/socio-economic/it-centre" },
  { label: "Sports", href: "/dashboard/socio-economic/sports" },
  { label: "Parking", href: "/dashboard/socio-economic/parking" },
  { label: "Water Pumps", href: "/dashboard/socio-economic/water-pumps" },
  { label: "Offices", href: "/dashboard/socio-economic/offices" },
  { label: "Other", href: "/dashboard/socio-economic/other" },
];

export default function SocioEconomicTabs() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 bg-white z-10">
      <div className="max-w-7xl mx-auto px-8 pt-7">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Socio-Economic
          </h1>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex whitespace-nowrap gap-12 border-b border-gray-200">
            {socioEconomicTabs.map((tab) => {
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`pb-4 px-1 font-medium text-sm transition-colors relative flex-shrink-0 ${
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
