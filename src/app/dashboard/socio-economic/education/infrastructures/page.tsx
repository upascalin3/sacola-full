"use client";

import React, { useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { educationInfrastructuresEntryData } from "@/lib/socio-economic/socio-economic";

const initialEntries: educationInfrastructuresEntryData[] = [
  {
    id: "1",
    schoolName: "Nyange Primary School",
    location: "Nyange Sector",
    infrastructureType: "Primary",
    dateDonated: new Date("2023-06-15"),
    description:
      "Complete primary school building with 8 classrooms, office, and library",
  },
  {
    id: "2",
    schoolName: "Kinigi Secondary School",
    location: "Kinigi Sector",
    infrastructureType: "Ordinary Level",
    dateDonated: new Date("2023-09-20"),
    description: "Secondary school building with science lab and computer room",
  },
  {
    id: "3",
    schoolName: "Ruhondo Early Childhood Center",
    location: "Ruhondo Sector",
    infrastructureType: "ECD",
    dateDonated: new Date("2024-01-10"),
    description:
      "Early childhood development center with play area and learning materials",
  },
  {
    id: "4",
    schoolName: "Musanze Vocational Training Center",
    location: "Musanze District",
    infrastructureType: "Vocational Training",
    dateDonated: new Date("2023-12-05"),
    description:
      "Vocational training facility for carpentry, welding, and tailoring",
  },
];

export default function EducationInfrastructuresPage() {
  const [entries, setEntries] =
    useState<educationInfrastructuresEntryData[]>(initialEntries);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="educationInfrastructures"
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
}
