"use client";

import React from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { healthCentresEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: healthCentresEntryData[] = [
  {
    id: "1",
    healthCentreName: "Kinigi Health Centre",
    location: "Kinigi",
    dateBuilt: new Date("2020-06-01"),
    description: "Primary health facility serving the community.",
  },
];

export default function HealthCentresPage() {
  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="healthCentres"
            entries={initialEntries}
          />
        </div>
      </div>
    </div>
  );
}

