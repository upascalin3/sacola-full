"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { itTrainingEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  itTrainingFromBackend,
  itTrainingToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: itTrainingEntryData[] = [];

export default function ItCentrePage() {
  const [entries, setEntries] = useState<itTrainingEntryData[]>(initialEntries);
  const { token } = useAuth();
  const { addToast } = useToast();

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
      addToast({
        type: "error",
        title: "Load Failed",
        message: "Failed to load IT training entries. Please try again.",
      });
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
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create IT training entry. Please try again.",
      });
    }
  };

  const handleUpdate = async (data: itTrainingEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Missing id for IT training update.",
      });
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
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update IT training entry. Please try again.",
      });
    }
  };

  const handleDelete = async (data: itTrainingEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Missing id for IT training deletion.",
      });
      return;
    }
    try {
      await SocioEconomicApi.itTraining.remove(token, String(id));
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));
      await loadData();
      addToast({
        type: "success",
        title: "Entry Deleted",
        message: "The IT training entry has been deleted successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete IT training entry. Please try again.",
      });
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
