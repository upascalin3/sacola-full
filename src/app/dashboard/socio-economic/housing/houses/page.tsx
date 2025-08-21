"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingHousesEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: HousingHousesEntryData[] = [
  {
    id: "1",
    houseCategory: "Vulnerable",
    location: "Nyange",
    dateBuilt: new Date("2024-03-15"),
    houseOwner: "John Doe",
    houseCondition: "Good",
    materials: "Chairs, 3 Mattresses, 2 Pillows",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    houseCategory: "1994 Genocide Survivor",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    houseOwner: "John Doe",
    houseCondition: "Good",
    materials: "Chairs, 3 Mattresses, 2 Pillows",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "3",
    houseCategory: "Vulnerable",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    houseOwner: "John Doe",
    houseCondition: "Good",
    materials: "Chairs, 3 Mattresses, 2 Pillows",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function HousingHousesPage() {
  const [entries, setEntries] =
    useState<HousingHousesEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingHouses"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
