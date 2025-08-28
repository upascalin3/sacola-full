"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingToiletsEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  housingToiletsFromBackend,
  housingToiletsToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: HousingToiletsEntryData[] = [];

export default function HousingToiletsPage() {
  const [entries, setEntries] =
    useState<HousingToiletsEntryData[]>(initialEntries);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const loadData = async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const res = await SocioEconomicApi.housingToilets.list(token);
      const items =
        (res as any)?.data?.items ||
        (res as any)?.items ||
        (Array.isArray(res) ? res : []);
      const loadedEntries = (items as any[]).map(housingToiletsFromBackend);
      setEntries(loadedEntries);
    } catch (err) {
      console.error("Failed to load Housing Toilets entries from API", err);
      // Don't fallback to localStorage - just show empty state
      setEntries([]);
    } finally {
      setIsLoading(false);
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
      const res = await SocioEconomicApi.housingToilets.create(
        token,
        housingToiletsToBackend(data)
      );
      const created = (res as any)?.data || res;
      const newEntry = housingToiletsFromBackend(created);
      setEntries((prev) => [newEntry, ...prev]);
      await loadData(); // Refresh from API
    } catch (err) {
      console.error("Failed to create Housing Toilets entry", err);
      // Don't save locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleUpdate = async (data: any) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for Housing Toilets update; aborting");
      return;
    }
    try {
      const res = await SocioEconomicApi.housingToilets.update(
        token,
        String(id),
        housingToiletsToBackend(data)
      );
      const updated = (res as any)?.data || res;
      const updatedEntry = housingToiletsFromBackend(updated);
      setEntries((prev) =>
        prev.map((e) => (e.id === String(id) ? updatedEntry : e))
      );
      await loadData(); // Refresh from API
    } catch (err) {
      console.error("Failed to update Housing Toilets entry", err);
      // Don't update locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleDelete = async (data: any) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for Housing Toilets delete; aborting");
      return;
    }
    try {
      await SocioEconomicApi.housingToilets.remove(token, String(id));
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));
      await loadData(); // Refresh from API
    } catch (err) {
      console.error("Failed to delete Housing Toilets entry", err);
      // Don't delete locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  if (isLoading) {
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
