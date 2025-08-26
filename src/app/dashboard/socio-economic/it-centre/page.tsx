"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { officesEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { officesFromBackend, officesToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: officesEntryData[] = [];

export default function ItCentrePage() {
  const [entries, setEntries] = useState<officesEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.offices.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(officesFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: officesEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.offices.create(token, officesToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [officesFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: officesEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.offices.update(token, String(id), officesToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? officesFromBackend(updated) : e)));
  };

  const handleDelete = async (data: officesEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.offices.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="offices"
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

