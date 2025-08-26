"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingHousesEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { housingHousesFromBackend, housingHousesToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: HousingHousesEntryData[] = [];

export default function HousingHousesPage() {
  const [entries, setEntries] =
    useState<HousingHousesEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.housingHouses.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(housingHousesFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: HousingHousesEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.housingHouses.create(token, housingHousesToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [housingHousesFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: HousingHousesEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.housingHouses.update(token, String(id), housingHousesToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? housingHousesFromBackend(updated) : e)));
  };

  const handleDelete = async (data: HousingHousesEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.housingHouses.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingHouses"
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
