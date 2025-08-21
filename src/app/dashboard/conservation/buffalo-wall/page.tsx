"use client";

import React, { useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationPageExample } from "../components";
import { buffaloWallEntryData } from "@/lib/conservation/conservation";

const initialBuffaloWallData: buffaloWallEntryData[] = [
  { id: "1", dateRepaired: new Date("2024-03-15"), cost: 50000 },
  { id: "2", dateRepaired: new Date("2024-02-20"), cost: 75000 },
];

export default function BuffaloWallPage() {
  const [buffaloWallData, setBuffaloWallData] = useState<
    buffaloWallEntryData[]
  >(initialBuffaloWallData);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <ConservationTabs />
        <div className="p-8">
          <ConservationPageExample
            conservationType="buffaloWall"
            entries={buffaloWallData}
          />
        </div>
      </div>
    </div>
  );
}
