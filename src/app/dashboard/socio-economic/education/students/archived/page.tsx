"use client";

import React, { useEffect, useState } from "react";
import {
  SocioEconomicTabs,
  SocioEconomicPageExample,
} from "../../../components";
import type { educationStudentsEntryData } from "@/lib/socio-economic/socio-economic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

export default function ArchivedStudentsPage() {
  const [entries, setEntries] = useState<educationStudentsEntryData[]>([]);

  useEffect(() => {
    setEntries(loadArchive());
  }, []);

  const handleUnarchive = (entry: educationStudentsEntryData) => {
    const nextArchive = entries.filter((e) => e.id !== entry.id);
    setEntries(nextArchive);
    saveArchive(nextArchive);
    const active = loadActive();
    saveActive([...active, entry]);
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <div className="mb-6">
            <Link href="/dashboard/socio-economic/education/students">
              <Button variant="outline">Back to Students</Button>
            </Link>
          </div>
          <SocioEconomicPageExample
            socioEconomicType="educationStudents"
            entries={entries}
            showAddButton={false}
            enableEdit={false}
            enableDelete={true}
            showUnarchive={true}
            onUnarchiveEntry={(d) =>
              handleUnarchive(d as educationStudentsEntryData)
            }
          />
        </div>
      </div>
    </div>
  );
}
