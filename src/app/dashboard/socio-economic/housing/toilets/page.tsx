"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingToiletsEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: HousingToiletsEntryData[] = [
  {
    id: "1",
    toiletType: "WC",
    toiletsBuilt: 69,
    location: "Nyange",
    dateDonated: new Date("2024-03-15"),
    targetBeneficiaries: 100,
    currentBeneficiaries: 70,
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    toiletType: "WC",
    toiletsBuilt: 120,
    location: "Kinigi",
    dateDonated: new Date("2024-03-15"),
    targetBeneficiaries: 200,
    currentBeneficiaries: 150,
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function HousingToiletsPage() {
  const [entries, setEntries] =
    useState<HousingToiletsEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingToilets"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
