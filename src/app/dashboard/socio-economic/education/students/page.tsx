"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { educationStudentsEntryData } from "@/lib/socio-economic/socio-economic";
import Link from "next/link";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { eduStudentsFromBackend, eduStudentsToBackend } from "@/lib/socio-economic/adapters";

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

const initialEntries: educationStudentsEntryData[] = [];

export default function EducationStudentsPage() {
  const [entries, setEntries] =
    useState<educationStudentsEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.educationStudents.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(eduStudentsFromBackend));
      } catch {}
    };
    load();
  }, [token]);

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
