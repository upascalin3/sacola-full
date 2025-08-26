"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { healthCentresEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { healthCentreFromBackend, healthCentreToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: healthCentresEntryData[] = [];

export default function HealthCentresPage() {
  const [entries, setEntries] = useState<healthCentresEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.healthCentres.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(healthCentreFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: healthCentresEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.healthCentres.create(token, healthCentreToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [healthCentreFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: healthCentresEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.healthCentres.update(token, String(id), healthCentreToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? healthCentreFromBackend(updated) : e)));
  };

  const handleDelete = async (data: healthCentresEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.healthCentres.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="healthCentres"
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

