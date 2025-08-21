"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { empowermentMicroFinanceEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: empowermentMicroFinanceEntryData[] = [
  {
    id: "1",
    name: "Tuzamurane",
    location: "Nyange",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    name: "Duteranimbaraga",
    location: "Kinigi",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function EmpowermentMicroFinancePage() {
  const [entries, setEntries] =
    useState<empowermentMicroFinanceEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="empowermentMicroFinance"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
