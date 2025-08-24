"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { educationStudentsEntryData } from "@/lib/socio-economic/socio-economic";
import Link from "next/link";

const ACTIVE_KEY = "educationStudentsActive";
const ARCHIVE_KEY = "educationStudentsArchive";

function loadActive(): educationStudentsEntryData[] {
  try {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(ACTIVE_KEY) : null;
    if (!raw) return [];
    return JSON.parse(raw) as educationStudentsEntryData[];
  } catch {
    return [];
  }
}

function saveActive(data: educationStudentsEntryData[]) {
  try {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(data));
  } catch {}
}

function loadArchive(): educationStudentsEntryData[] {
  try {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(ARCHIVE_KEY) : null;
    if (!raw) return [];
    return JSON.parse(raw) as educationStudentsEntryData[];
  } catch {
    return [];
  }
}

function saveArchive(data: educationStudentsEntryData[]) {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(data));
  } catch {}
}

const initialEntries: educationStudentsEntryData[] = [
  {
    id: "1",
    studentName: "Jean Pierre Uwimana",
    studentLocation: "Nyange Sector",
    schoolName: "Nyange Primary School",
    schoolLocation: "Nyange",
    class: "Primary 6",
    fundingYears: 3,
    description:
      "Orphan student receiving full educational support including school fees, uniforms, and materials",
  },
  {
    id: "2",
    studentName: "Marie Claire Mukamana",
    studentLocation: "Kinigi Sector",
    schoolName: "Kinigi Secondary School",
    schoolLocation: "Kinigi",
    class: "Senior 3",
    fundingYears: 2,
    description:
      "Student from vulnerable family receiving partial support for school fees and materials",
  },
];

export default function EducationStudentsPage() {
  const [entries, setEntries] =
    useState<educationStudentsEntryData[]>(initialEntries);

  useEffect(() => {
    const existing = loadActive();
    if (existing.length === 0) {
      saveActive(initialEntries);
      setEntries(initialEntries);
    } else {
      setEntries(existing);
    }
  }, []);

  const handleArchive = (entry: educationStudentsEntryData) => {
    const nextActive = entries.filter((e) => e.id !== entry.id);
    setEntries(nextActive);
    saveActive(nextActive);
    const archive = loadArchive();
    saveArchive([...archive, entry]);
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex gap-6 text-sm">
              <span className="py-2 px-1 border-b-2 border-[#54D12B] text-[#54D12B]">
                Supported Students
              </span>
              <Link
                href="/dashboard/socio-economic/education/students/archived"
                className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Archived Students
              </Link>
            </nav>
          </div>

          <SocioEconomicPageExample
            socioEconomicType="educationStudents"
            entries={entries}
            showAddButton={true}
            enableEdit={true}
            enableDelete={true}
            showArchive={true}
            onArchiveEntry={(d) =>
              handleArchive(d as educationStudentsEntryData)
            }
          />
        </div>
      </div>
    </div>
  );
}
