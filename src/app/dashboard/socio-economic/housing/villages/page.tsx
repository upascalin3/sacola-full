"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingVillagesEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { housingVillagesFromBackend, housingVillagesToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: HousingVillagesEntryData[] = [];

export default function HousingVillagesPage() {
  const [entries, setEntries] =
    useState<HousingVillagesEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.housingVillages.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(housingVillagesFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: HousingVillagesEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.housingVillages.create(token, housingVillagesToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [housingVillagesFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: HousingVillagesEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.housingVillages.update(token, String(id), housingVillagesToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? housingVillagesFromBackend(updated) : e)));
  };

  const handleDelete = async (data: HousingVillagesEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.housingVillages.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingVillages"
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
