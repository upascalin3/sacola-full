"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingVillagesEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  housingVillagesFromBackend,
  housingVillagesToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: HousingVillagesEntryData[] = [];

export default function HousingVillagesPage() {
  const [entries, setEntries] =
    useState<HousingVillagesEntryData[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.housingVillages.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(housingVillagesFromBackend));
    } catch (err) {
      console.error("Failed to load Housing Villages entries", err);
    } finally {
      setLoading(false);
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

  const handleCreate = async (data: any) => {
    if (!token) return;
    try {
      const res = await SocioEconomicApi.housingVillages.create(
        token,
        housingVillagesToBackend(data)
      );
      const created = (res as any)?.data || res;
      const newEntry = housingVillagesFromBackend(created);
      setEntries((prev) => [newEntry, ...prev]);
      await loadData(); // Refresh from API
    } catch (err) {
      console.error("Failed to create Housing Villages entry", err);
      // Don't save locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleUpdate = async (data: any) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for Housing Villages update; aborting");
      return;
    }
    try {
      const res = await SocioEconomicApi.housingVillages.update(
        token,
        String(id),
        housingVillagesToBackend(data)
      );
      const updated = (res as any)?.data || res;
      const updatedEntry = housingVillagesFromBackend(updated);
      setEntries((prev) =>
        prev.map((e) => (e.id === String(id) ? updatedEntry : e))
      );
      await loadData(); // Refresh from API
    } catch (err) {
      console.error("Failed to update Housing Villages entry", err);
      // Don't update locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleDelete = async (data: any) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for Housing Villages delete; aborting");
      return;
    }
    try {
      await SocioEconomicApi.housingVillages.remove(token, String(id));
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));
      await loadData(); // Refresh from API
    } catch (err) {
      console.error("Failed to delete Housing Villages entry", err);
      // Don't delete locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  if (loading) {
    return (
      <div className="ml-64 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SocioEconomicTabs />
          <div className="p-8 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#54D12B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

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
