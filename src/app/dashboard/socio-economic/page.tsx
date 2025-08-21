"use client";

import React, { useState } from "react";
import SocioEconomicTabs from "./components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "./components/SocioEconomicPageExample";
import type { LivestockEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: LivestockEntryData[] = [
  {
    id: "1",
    animalType: "Goats",
    location: "Nyange",
    distributedAnimals: 200,
    deaths: 20,
    currentlyOwned: 100,
    transferredAnimals: 12,
    soldAnimals: 30,
    dateDonated: new Date("2024-03-15"),
    targetBeneficiaries: 1000,
    currentBeneficiaries: 834,
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    animalType: "Cows",
    location: "Kinigi",
    distributedAnimals: 200,
    deaths: 20,
    currentlyOwned: 100,
    transferredAnimals: 12,
    soldAnimals: 30,
    dateDonated: new Date("2024-03-15"),
    targetBeneficiaries: 1000,
    currentBeneficiaries: 834,
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function SocioEconomicPage() {
  const [entries, setEntries] = useState<LivestockEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="livestock"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
