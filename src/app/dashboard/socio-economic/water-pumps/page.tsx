"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../components";
import { waterPumpsEntryData } from "@/lib/socio-economic/socio-economic";

const initialWaterPumpsData: waterPumpsEntryData[] = [
  {
    id: "1",
    pumpName: "Pump 1",
    location: "Nyange",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Good",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    pumpName: "Pump 2",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Bad",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "3",
    pumpName: "Pump 3",
    location: "Nyange",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Bad",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "4",
    pumpName: "Pump 4",
    location: "Nyange",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Good",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "5",
    pumpName: "Pump 5",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Good",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "6",
    pumpName: "Pump 6",
    location: "Nyange",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Good",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "7",
    pumpName: "Pump 7",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Bad",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function WaterPumpsPage() {
  const [waterPumpsData, setWaterPumpsData] = useState<waterPumpsEntryData[]>(
    initialWaterPumpsData
  );

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="waterPumps"
            entries={waterPumpsData}
          />
        </div>
      </div>
    </div>
  );
}
