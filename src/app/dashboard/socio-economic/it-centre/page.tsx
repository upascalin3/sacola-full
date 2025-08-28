"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { itTrainingEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  itTrainingFromBackend,
  itTrainingToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: itTrainingEntryData[] = [];

export default function ItCentrePage() {
  const [entries, setEntries] = useState<itTrainingEntryData[]>(initialEntries);
  const { token } = useAuth();

  const loadData = async () => {
    if (!token) return;
    try {
      const res = await SocioEconomicApi.itTraining.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(itTrainingFromBackend));
    } catch (err) {
      console.error("Failed to load IT Training entries", err);
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

  const handleCreate = async (data: itTrainingEntryData) => {
    if (!token) return;
    try {
      const res = await SocioEconomicApi.itTraining.create(
        token,
        itTrainingToBackend(data)
      );
      const created = (res as any)?.data || res;
      setEntries((prev) => [itTrainingFromBackend(created), ...prev]);
      await loadData();
    } catch (err) {
      console.error("Failed to create IT Training entry", err);
    }
  };

  const handleUpdate = async (data: itTrainingEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for IT Training update; aborting");
      return;
    }
    try {
      const res = await SocioEconomicApi.itTraining.update(
        token,
        String(id),
        itTrainingToBackend(data) as any
      );
      const updated = (res as any)?.data || res;
      setEntries((prev) =>
        prev.map((e) =>
          e.id === String(id) ? itTrainingFromBackend(updated) : e
        )
      );
      await loadData();
    } catch (err) {
      console.error("Failed to update IT Training entry", err);
    }
  };

  const handleDelete = async (data: itTrainingEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for IT Training delete; aborting");
      return;
    }
    try {
      await SocioEconomicApi.itTraining.remove(token, String(id));
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));
      await loadData();
    } catch (err) {
      console.error("Failed to delete IT Training entry", err);
    }
  };

  return (
    <div className="ml-64 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="itTraining"
            entries={entries}
            onCreateEntry={handleCreate as any}
            onUpdateEntry={handleUpdate as any}
            onDeleteEntry={handleDelete as any}
          />
        </div>
      </div>
    </div>
  );
}
