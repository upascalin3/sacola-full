"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingMaterialsEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { housingMaterialsFromBackend, housingMaterialsToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: HousingMaterialsEntryData[] = [];

export default function HousingMaterialsPage() {
  const [entries, setEntries] =
    useState<HousingMaterialsEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.housingMaterials.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(housingMaterialsFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: HousingMaterialsEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.housingMaterials.create(token, housingMaterialsToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [housingMaterialsFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: HousingMaterialsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.housingMaterials.update(token, String(id), housingMaterialsToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? housingMaterialsFromBackend(updated) : e)));
  };

  const handleDelete = async (data: HousingMaterialsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.housingMaterials.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingMaterials"
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
