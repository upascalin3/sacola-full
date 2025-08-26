"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingToiletsEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { housingToiletsFromBackend, housingToiletsToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: HousingToiletsEntryData[] = [];

export default function HousingToiletsPage() {
  const [entries, setEntries] =
    useState<HousingToiletsEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.housingToilets.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(housingToiletsFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: HousingToiletsEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.housingToilets.create(token, housingToiletsToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [housingToiletsFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: HousingToiletsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.housingToilets.update(token, String(id), housingToiletsToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? housingToiletsFromBackend(updated) : e)));
  };

  const handleDelete = async (data: HousingToiletsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.housingToilets.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="housingToilets"
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
