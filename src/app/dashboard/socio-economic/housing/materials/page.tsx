"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingMaterialsEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: HousingMaterialsEntryData[] = [
  {
    id: "1",
    materialType: "Iron Sheets",
    location: "Nyange",
    dateDonated: new Date("2024-03-15"),
    distributedMaterials: 100,
    targetBeneficiaries: 500,
    currentBeneficiaries: 450,
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    materialType: "Iron Sheets",
    location: "Kinigi",
    dateDonated: new Date("2024-03-15"),
    distributedMaterials: 100,
    targetBeneficiaries: 500,
    currentBeneficiaries: 100,
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "3",
    materialType: "Iron Sheets",
    location: "Kinigi",
    dateDonated: new Date("2024-03-15"),
    distributedMaterials: 100,
    targetBeneficiaries: 500,
    currentBeneficiaries: 100,
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function HousingMaterialsPage() {
  const [entries, setEntries] =
    useState<HousingMaterialsEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingMaterials"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
