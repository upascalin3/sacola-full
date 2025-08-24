"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { educationMaterialsEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: educationMaterialsEntryData[] = [
  {
    id: "1",
    materialType: "Textbooks",
    location: "Nyange Primary School",
    distributedMaterials: 150,
    dateDonated: new Date("2024-01-15"),
    targetBeneficiaries: 200,
    currentBeneficiaries: 180,
    description: "Mathematics and Science textbooks for primary students",
  },
  {
    id: "2",
    materialType: "Exercise Books",
    location: "Kinigi Secondary School",
    distributedMaterials: 300,
    dateDonated: new Date("2024-02-20"),
    targetBeneficiaries: 250,
    currentBeneficiaries: 250,
    description: "Exercise books for all subjects and grade levels",
  },
  {
    id: "3",
    materialType: "Pens and Pencils",
    location: "Ruhondo Community School",
    distributedMaterials: 500,
    dateDonated: new Date("2024-03-10"),
    targetBeneficiaries: 400,
    currentBeneficiaries: 380,
    description: "Writing materials for students in need",
  },
];

export default function EducationMaterialsPage() {
  const [entries, setEntries] =
    useState<educationMaterialsEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="educationMaterials"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
