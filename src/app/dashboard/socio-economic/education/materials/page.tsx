"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { educationMaterialsEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { eduMaterialsFromBackend, eduMaterialsToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: educationMaterialsEntryData[] = [];

export default function EducationMaterialsPage() {
  const [entries, setEntries] =
    useState<educationMaterialsEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.educationMaterials.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(eduMaterialsFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: educationMaterialsEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.educationMaterials.create(token, eduMaterialsToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [eduMaterialsFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: educationMaterialsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.educationMaterials.update(token, String(id), eduMaterialsToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? eduMaterialsFromBackend(updated) : e)));
  };

  const handleDelete = async (data: educationMaterialsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.educationMaterials.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="educationMaterials"
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
