"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingRepairmentsEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { housingRepairsFromBackend, housingRepairsToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: HousingRepairmentsEntryData[] = [];

export default function HousingRepairmentsPage() {
  const [entries, setEntries] =
    useState<HousingRepairmentsEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.housingRepairs.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(housingRepairsFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: HousingRepairmentsEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.housingRepairs.create(token, housingRepairsToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [housingRepairsFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: HousingRepairmentsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.housingRepairs.update(token, String(id), housingRepairsToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? housingRepairsFromBackend(updated) : e)));
  };

  const handleDelete = async (data: HousingRepairmentsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.housingRepairs.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingRepairments"
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
