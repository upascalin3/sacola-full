"use client";

import React, { useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationPageExample } from "../components";
import { EUfundedEntryData } from "@/lib/conservation/conservation";

const initialEUFundedData: EUfundedEntryData[] = [
  {
    id: "1",
    district: "Musanze",
    location: "Nyange",
    treesPlanted: 2000,
    datePlanted: new Date("2024-03-15"),
    targetBeneficiaries: 800,
    currentBeneficiaries: 750,
    description: "EU-funded reforestation project in Nyange area",
  },
  {
    id: "2",
    district: "Musanze",
    location: "Kinigi",
    treesPlanted: 1500,
    datePlanted: new Date("2024-02-20"),
    targetBeneficiaries: 600,
    currentBeneficiaries: 580,
    description: "European Union conservation initiative in Kinigi",
  },
];

export default function EUProPage() {
  const [euFundedData, setEUFundedData] =
    useState<EUfundedEntryData[]>(initialEUFundedData);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <ConservationTabs />
        <div className="p-8">
          <ConservationPageExample
            conservationType="euFunded"
            entries={euFundedData}
          />
        </div>
      </div>
    </div>
  );
}
