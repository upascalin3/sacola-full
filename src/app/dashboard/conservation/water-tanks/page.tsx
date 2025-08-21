"use client";

import React, { useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationPageExample } from "../components";
import { WaterTanksEntryData } from "@/lib/conservation/conservation";

const initialWaterTankData: WaterTanksEntryData[] = [
  {
    id: "1",
    waterTankType: "Plastic Tank",
    location: "Nyange",
    numberOfWaterTanks: 5,
    dateDonated: new Date("2024-03-15"),
    targetBeneficiaries: 500,
    currentBeneficiaries: 450,
    description: "Large capacity water tanks for community use",
  },
  {
    id: "2",
    waterTankType: "Stones Tank",
    location: "Kinigi",
    numberOfWaterTanks: 10,
    dateDonated: new Date("2024-02-20"),
    targetBeneficiaries: 300,
    currentBeneficiaries: 280,
    description: "Medium-sized tanks for household water storage",
  },
];

export default function WaterTanksPage() {
  const [waterTankData, setWaterTankData] =
    useState<WaterTanksEntryData[]>(initialWaterTankData);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <ConservationTabs />
        <div className="p-8">
          <ConservationPageExample
            conservationType="waterTanks"
            entries={waterTankData}
          />
        </div>
      </div>
    </div>
  );
}
