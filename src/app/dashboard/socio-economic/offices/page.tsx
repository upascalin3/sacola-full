"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { officesEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  officesFromBackend,
  officesToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: officesEntryData[] = [];

export default function OfficesPage() {
  const [entries, setEntries] = useState<officesEntryData[]>(initialEntries);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const loadData = async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const res = await SocioEconomicApi.offices.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      const loadedEntries = (items as any[]).map(officesFromBackend);
      setEntries(loadedEntries);
    } catch (err) {
      console.error("Failed to load Offices entries from API", err);
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
      const res = await SocioEconomicApi.offices.create(
        token,
        officesToBackend(data)
      );
      const created = (res as any)?.data || res;
      const newEntry = officesFromBackend(created);
      setEntries((prev) => [newEntry, ...prev]);
      await loadData(); // Refresh from API
    } catch (err) {
      console.error("Failed to create Offices entry", err);
      // Don't save locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleUpdate = async (data: any) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for Offices update; aborting");
      return;
    }
    try {
      const res = await SocioEconomicApi.offices.update(
        token,
        String(id),
        officesToBackend(data) as any
      );
      const updated = (res as any)?.data || res;
      const updatedEntry = officesFromBackend(updated);
      setEntries((prev) =>
        prev.map((e) => (e.id === String(id) ? updatedEntry : e))
      );
      await loadData(); // Refresh from API
    } catch (err) {
      console.error("Failed to update Offices entry", err);
      // Don't update locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleDelete = async (data: any) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      console.error("Missing id for Offices delete; aborting");
      return;
    }
    try {
      await SocioEconomicApi.offices.remove(token, String(id));
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));
      await loadData(); // Refresh from API
    } catch (err) {
      console.error("Failed to delete Offices entry", err);
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
    <div className="ml-64 overflow-hidden">
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
