"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { sportsEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { sportsFromBackend, sportsToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: sportsEntryData[] = [];

export default function SportsPage() {
  const [entries, setEntries] = useState<sportsEntryData[]>(initialEntries);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.sports.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(sportsFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: sportsEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.sports.create(token, sportsToBackend(data));
    const created = (res as any)?.data || res;
    setEntries((prev) => [sportsFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: sportsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.sports.update(token, String(id), sportsToBackend(data));
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? sportsFromBackend(updated) : e)));
  };

  const handleDelete = async (data: sportsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.sports.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="sports"
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
