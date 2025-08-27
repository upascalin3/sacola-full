"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "./components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "./components/SocioEconomicPageExample";
import type { LivestockEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { livestockFromBackend, livestockToBackend } from "@/lib/socio-economic/adapters";

const initialEntries: LivestockEntryData[] = [];

export default function SocioEconomicPage() {
  const [entries, setEntries] = useState<LivestockEntryData[]>(initialEntries);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.livestock.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : (payload?.data?.items || payload?.items || (Array.isArray(payload) ? payload : []));
      setEntries((items as any[]).map(livestockFromBackend));
    } catch (err) {
      console.error("Failed to load Livestock entries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  useEffect(() => {
    const onFocus = () => loadData();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') loadData();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [token]);

  const handleCreate = async (data: LivestockEntryData) => {
    if (!token) return;
    try {
      const payload = livestockToBackend(data);
      const res = await SocioEconomicApi.livestock.create(token, payload);
      const created = (res as any)?.data || res;
      setEntries((prev) => [livestockFromBackend(created), ...prev]);
      await loadData();
    } catch (err) {
      console.error("Failed to create Livestock entry", err);
    }
  };
  
  const handleUpdate = async (data: LivestockEntryData) => {
    if (!token) return;
    try {
      const payload = livestockToBackend(data);
      const id = String((data as any)?.id || "");
      if (!id) {
        console.error("Missing id for Livestock update; aborting");
        return;
      }
      const res = await SocioEconomicApi.livestock.update(token, String(id), payload as any);
      const updated = (res as any)?.data || res;
      setEntries((prev) => prev.map((item) => item.id === String(id) ? livestockFromBackend(updated) : item));
      await loadData();
    } catch (err) {
      console.error("Failed to update Livestock entry", err);
    }
  };

  const handleDelete = async (data: LivestockEntryData) => {
    if (!token) return;
    try {
      const id = String((data as any)?.id || "");
      if (!id) {
        console.error("Missing id for Livestock delete; aborting");
        return;
      }
      await SocioEconomicApi.livestock.remove(token, String(id));
      setEntries((prev) => prev.filter((item) => item.id !== String(id)));
      await loadData();
    } catch (err) {
      console.error("Failed to delete Livestock entry", err);
    }
  };


  if (loading) {
    return (
      <div className="ml-64">
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
            socioEconomicType="livestock"
            entries={entries}
            onUpdateEntry={handleUpdate as any}
            onCreateEntry={handleCreate as any}
            onDeleteEntry={handleDelete as any}
          />
        </div>
      </div>
    </div>
  );
}
