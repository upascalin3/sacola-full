"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingHousesEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  housingHousesFromBackend,
  housingHousesToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: HousingHousesEntryData[] = [];

export default function HousingHousesPage() {
  const [entries, setEntries] =
    useState<HousingHousesEntryData[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.housingHouses.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(housingHousesFromBackend));
    } catch (err) {
      console.error("Failed to load Housing Houses entries", err);
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
      if (document.visibilityState === "visible") loadData();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [token]);

  const handleCreate = async (data: any) => {
    if (!token) return;
    try {
      const payload = housingHousesToBackend(data);
      const res = await SocioEconomicApi.housingHouses.create(token, payload);
      const created = (res as any)?.data || res;
      setEntries((prev) => [housingHousesFromBackend(created), ...prev]);
      await loadData();
    } catch (err) {
      console.error("Failed to create Housing Houses entry", err);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!token) return;
    try {
      const payload = housingHousesToBackend(data);
      const id = String((data as any)?.id || "");
      if (!id) {
        console.error("Missing id for Housing Houses update; aborting");
        return;
      }
      const res = await SocioEconomicApi.housingHouses.update(
        token,
        String(id),
        payload as any
      );
      const updated = (res as any)?.data || res;
      setEntries((prev) =>
        prev.map((item) =>
          item.id === String(id) ? housingHousesFromBackend(updated) : item
        )
      );
      await loadData();
    } catch (err) {
      console.error("Failed to update Housing Houses entry", err);
    }
  };

  const handleDelete = async (data: any) => {
    if (!token) return;
    try {
      const id = String((data as any)?.id || "");
      if (!id) {
        console.error("Missing id for Housing Houses delete; aborting");
        return;
      }
      await SocioEconomicApi.housingHouses.remove(token, String(id));
      setEntries((prev) => prev.filter((item) => item.id !== String(id)));
      await loadData();
    } catch (err) {
      console.error("Failed to delete Housing Houses entry", err);
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
            socioEconomicType="housingHouses"
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
