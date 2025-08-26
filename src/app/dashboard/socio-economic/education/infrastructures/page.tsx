"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { educationInfrastructuresEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { eduInfraFromBackend, eduInfraToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: educationInfrastructuresEntryData[] = [];

export default function EducationInfrastructuresPage() {
  const [entries, setEntries] =
    useState<educationInfrastructuresEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.educationInfrastructures.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(eduInfraFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: educationInfrastructuresEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.educationInfrastructures.create(token, eduInfraToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [eduInfraFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: educationInfrastructuresEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.educationInfrastructures.update(token, String(id), eduInfraToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? eduInfraFromBackend(updated) : e)));
  };

  const handleDelete = async (data: educationInfrastructuresEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.educationInfrastructures.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="educationInfrastructures"
            entries={entries}
            onCreateEntry={handleCreate}
            onUpdateEntry={handleUpdate}
            onDeleteEntry={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
