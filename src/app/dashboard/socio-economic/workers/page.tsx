"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { workersEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { workersFromBackend, workersToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: workersEntryData[] = [];

export default function WorkersPage() {
  const [entries, setEntries] = useState<workersEntryData[]>(initialEntries);
  const { token } = useAuth();

  const loadData = async () => {
    if (!token) return;
    try {
      const res = await SocioEconomicApi.workers.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items || payload?.items || (Array.isArray(res) ? res : []);
      const transformed = (items as any[]).map(workersFromBackend);
      setEntries(transformed);
    } catch (err) {
      console.error("Failed to load Workers entries", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState === "visible") loadData();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [token]);

  const handleCreate = async (data: workersEntryData) => {
    if (!token) return;
    try {
      const res = await SocioEconomicApi.workers.create(token, workersToBackend(data));
      const created = (res as any)?.data || res;
      setEntries((prev) => [workersFromBackend(created), ...prev]);
      await loadData();
    } catch (err) {
      console.error("Failed to create Worker entry", err);
    }
  };

  const handleUpdate = async (data: workersEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for Workers update; aborting");
      return;
    }
    const res = await SocioEconomicApi.workers.update(
      token,
      String(id),
      workersToBackend(data) as any
    );
    const updated = (res as any)?.data || res;
    setEntries((prev) => prev.map((e) => (e.id === String(id) ? workersFromBackend(updated) : e)));
    await loadData();
  };

  const handleDelete = async (data: workersEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for Workers delete; aborting");
      return;
    }
    await SocioEconomicApi.workers.remove(token, String(id));
    setEntries((prev) => prev.filter((e) => e.id !== String(id)));
    await loadData();
  };

  return (
    <div className="ml-64 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="workers"
            entries={entries as any}
            onCreateEntry={handleCreate as any}
            onUpdateEntry={handleUpdate as any}
            onDeleteEntry={handleDelete as any}
          />
        </div>
      </div>
    </div>
  );
}


