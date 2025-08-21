"use client";

import React, { useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationPageExample } from "../components";
import { BambooEntryData } from "@/lib/conservation/conservation";

const initialBambooData: BambooEntryData[] = [
  {
    id: "1",
    distanceCovered: 500,
    location: "Nyange",
    dateDonated: new Date("2024-03-15"),
    description: "Bamboo planting along riverbank for erosion control",
  },
  {
    id: "2",
    distanceCovered: 300,
    location: "Kinigi",
    dateDonated: new Date("2024-02-20"),
    description: "Bamboo fence installation for property demarcation",
  },
];

export default function BambooPage() {
  const [bambooData, setBambooData] =
    useState<BambooEntryData[]>(initialBambooData);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <ConservationTabs />
        <div className="p-8">
          <ConservationPageExample
            conservationType="bamboo"
            entries={bambooData}
          />
        </div>
      </div>
    </div>
  );
}
