"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingVillagesEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: HousingVillagesEntryData[] = [
  {
    id: "1",
    villageName: "Village 1",
    location: "Nyange",
    totalHouses: 250,
    dateBuilt: new Date("2024-03-15"),
    goodCondition: 190,
    badCondition: 60,
    badConditionDescription: "Damaged by floods and earthquakes",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    villageName: "Village 2",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    totalHouses: 215,
    goodCondition: 200,
    badCondition: 15,
    badConditionDescription: "Damaged by floods and earthquakes",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "3",
    villageName: "Village 3",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    totalHouses: 190,
    goodCondition: 183,
    badCondition: 7,
    badConditionDescription: "Damaged by earthquakes",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function HousingVillagesPage() {
  const [entries, setEntries] =
    useState<HousingVillagesEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingVillages"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
