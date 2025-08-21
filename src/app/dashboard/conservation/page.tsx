"use client";

import React, { useState } from "react";
import ConservationTabs from "./components/ConservationTabs";
import { ConservationPageExample } from "./components";
import { TreeEntryData } from "@/lib/conservation/conservation";

const initialTreePlantingData: TreeEntryData[] = [
  {
    id: "1",
    treeType: "Avocados",
    location: "Nyange",
    numberOfTrees: 1000,
    datePlanted: new Date("2024-03-15"),
    targetBeneficiaries: 1000,
    currentBeneficiaries: 834,
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    treeType: "Passion Fruits",
    location: "Kinigi",
    numberOfTrees: 300,
    datePlanted: new Date("2024-02-20"),
    targetBeneficiaries: 300,
    currentBeneficiaries: 250,
    description: "Passion fruit trees planted in Kinigi area",
  },
  {
    id: "3",
    treeType: "Ornament Trees",
    location: "Kinigi",
    numberOfTrees: 1000,
    datePlanted: new Date("2024-01-10"),
    targetBeneficiaries: 500,
    currentBeneficiaries: 450,
    description: "Ornamental trees for beautification",
  },
  {
    id: "4",
    treeType: "Seedlings",
    location: "Nyange",
    numberOfTrees: 200,
    datePlanted: new Date("2024-04-05"),
    targetBeneficiaries: 200,
    currentBeneficiaries: 180,
    description: "Various seedling types planted",
  },
  {
    id: "5",
    treeType: "Forest Trees",
    location: "Kinigi",
    numberOfTrees: 400,
    datePlanted: new Date("2024-03-01"),
    targetBeneficiaries: 400,
    currentBeneficiaries: 380,
    description: "Forest conservation trees",
  },
  {
    id: "6",
    treeType: "Mango Trees",
    location: "Nyange",
    numberOfTrees: 150,
    datePlanted: new Date("2024-05-10"),
    targetBeneficiaries: 150,
    currentBeneficiaries: 120,
    description: "Mango trees for fruit production",
  },
  {
    id: "7",
    treeType: "Coffee Trees",
    location: "Kinigi",
    numberOfTrees: 800,
    datePlanted: new Date("2024-04-20"),
    targetBeneficiaries: 600,
    currentBeneficiaries: 550,
    description: "Coffee trees for economic development",
  },
  {
    id: "8",
    treeType: "Tea Trees",
    location: "Nyange",
    numberOfTrees: 600,
    datePlanted: new Date("2024-03-25"),
    targetBeneficiaries: 400,
    currentBeneficiaries: 380,
    description: "Tea trees for sustainable agriculture",
  },
];

export default function ConservationPage() {
  const [treeData, setTreeData] = useState<TreeEntryData[]>(
    initialTreePlantingData
  );

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <ConservationTabs />
        <div className="p-8">
          <ConservationPageExample conservationType="tree" entries={treeData} />
        </div>
      </div>
    </div>
  );
}
