"use client";

import React from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { officesEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: officesEntryData[] = [
  {
    id: "1",
    officeName: "Kinigi IT Centre",
    location: "Kinigi",
    dateBuilt: new Date("2023-06-12"),
    description: "Community IT centre with training labs and internet access.",
  },
];

export default function ItCentrePage() {
  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="offices"
            entries={initialEntries}
          />
        </div>
      </div>
    </div>
  );
}

