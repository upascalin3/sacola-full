"use client";

import React from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { officesEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: officesEntryData[] = [
  {
    id: "1",
    officeName: "Nyange Admin Office",
    location: "Nyange",
    dateBuilt: new Date("2019-03-15"),
    description: "Administrative office supporting local operations.",
  },
];

export default function OfficesPage() {
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
