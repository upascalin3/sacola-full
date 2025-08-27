"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { empowermentTailoringEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: empowermentTailoringEntryData[] = [
  {
    id: "1",
    tailoringCenter: "center 1",
    location: "Nyange",
    people: 200,
    date: new Date("2024-02-15T00:00:00.000Z"),
    trainingDuration: "6 months",
    materials: "Imashini zo kudoda",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    tailoringCenter: "center 2",
    location: "Kinigi",
    people: 122,
    date: new Date("2025-01-12T00:00:00.000Z"),
    trainingDuration: "1 year",
    materials: "Imashini zo kudoda",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function EmpowermentTailoringPage() {
  const [entries, setEntries] =
    useState<empowermentTailoringEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="empowermentTailoring"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
