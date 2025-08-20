"use client";

import React from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";

const initialEntries = [
  {
    id: "1",
    parkingName: "Kinigi Public Parking",
    carsSupported: 120,
    location: "Kinigi",
    dateBuilt: new Date("2022-02-20"),
    description: "Central parking area near the market.",
  },
];

export default function ParkingPage() {
  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="parking"
            entries={initialEntries}
          />
        </div>
      </div>
    </div>
  );
}

