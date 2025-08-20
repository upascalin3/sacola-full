"use client";

import React from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { sportsEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: sportsEntryData[] = [
  {
    id: "1",
    sportName: "Basketball",
    location: "Kinigi",
    condition: "Good",
    dateBuilt: new Date("2021-10-01"),
    description: "Outdoor basketball court with seating.",
  },
];

export default function SportsPage() {
  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="sports"
            entries={initialEntries}
          />
        </div>
      </div>
    </div>
  );
}
