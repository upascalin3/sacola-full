"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { HousingRepairmentsEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  housingRepairsFromBackend,
  housingRepairsToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: HousingRepairmentsEntryData[] = [];

export default function HousingRepairmentsPage() {
  const [entries, setEntries] =
    useState<HousingRepairmentsEntryData[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { addToast } = useToast();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.housingRepairs.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(housingRepairsFromBackend));
    } catch (err) {
      addToast({
        type: "error",
        title: "Load Failed",
        message: "Failed to load housing repairs entries. Please try again.",
      });
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
      const res = await SocioEconomicApi.housingRepairs.create(
        token,
        housingRepairsToBackend(data)
      );
      const created = (res as any)?.data || res;
      const newEntry = housingRepairsFromBackend(created);
      setEntries((prev) => [newEntry, ...prev]);
      await loadData(); // Refresh from API
    } catch (err) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create housing repair entry. Please try again.",
      });
      // Don't save locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleUpdate = async (data: any) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Missing id for housing repair update.",
      });
      return;
    }
    try {
      const res = await SocioEconomicApi.housingRepairs.update(
        token,
        String(id),
        housingRepairsToBackend(data)
      );
      const updated = (res as any)?.data || res;
      const updatedEntry = housingRepairsFromBackend(updated);
      setEntries((prev) =>
        prev.map((e) => (e.id === String(id) ? updatedEntry : e))
      );
      await loadData(); // Refresh from API
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update housing repair entry. Please try again.",
      });
      // Don't update locally - just show error
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleDelete = async (data: any) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Missing id for housing repair deletion.",
      });
      return;
    }
    try {
      await SocioEconomicApi.housingRepairs.remove(token, String(id));
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));
      await loadData(); // Refresh from API
      addToast({
        type: "success",
        title: "Entry Deleted",
        message: "The housing repair entry has been deleted successfully.",
      });
    } catch (err) {
      // Don't delete locally - just show error
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete housing repair entry. Please try again.",
      });
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
            socioEconomicType="housingRepairments"
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
