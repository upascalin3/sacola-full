"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingRepairmentsEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: HousingRepairmentsEntryData[] = [
  {
    id: "1",
    houseOwner: "John Doe",
    location: "Nyange",
    dateRepaired: new Date("2024-03-15"),
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    houseOwner: "John Doe",
    location: "Kinigi",
    dateRepaired: new Date("2024-03-15"),
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "3",
    location: "Kinigi",
    dateRepaired: new Date("2024-03-15"),
    houseOwner: "John Doe",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function HousingRepairmentsPage() {
  const [entries, setEntries] =
    useState<HousingRepairmentsEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingRepairments"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
