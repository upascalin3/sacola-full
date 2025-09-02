"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { sportsEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  sportsFromBackend,
  sportsToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: sportsEntryData[] = [];

export default function SportsPage() {
  const [entries, setEntries] = useState<sportsEntryData[]>(initialEntries);
  const { token } = useAuth();
  const { addToast } = useToast();

  const loadData = async () => {
    if (!token) return;
    try {
      const res = await SocioEconomicApi.sports.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(res) ? res : []);

      const transformedEntries = (items as any[]).map(sportsFromBackend);
      setEntries(transformedEntries);
    } catch (err) {
      addToast({
        type: "error",
        title: "Load Failed",
        message: "Failed to load sports entries. Please try again.",
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

  const handleCreate = async (data: sportsEntryData) => {
    if (!token) return;
    try {
      const res = await SocioEconomicApi.sports.create(
        token,
        sportsToBackend(data)
      );
      const created = (res as any)?.data || res;
      setEntries((prev) => [sportsFromBackend(created), ...prev]);
      await loadData();
    } catch (err) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create sports entry. Please try again.",
      });
    }
  };

  const handleUpdate = async (data: sportsEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Missing id for sports update.",
      });
      return;
    }
    const res = await SocioEconomicApi.sports.update(
      token,
      String(id),
      sportsToBackend(data) as any
    );
    const updated = (res as any)?.data || res;
    setEntries((prev) =>
      prev.map((e) => (e.id === String(id) ? sportsFromBackend(updated) : e))
    );
    await loadData();
  };

  const handleDelete = async (data: sportsEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Missing id for sports deletion.",
      });
      return;
    }
    try {
      await SocioEconomicApi.sports.remove(token, String(id));
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));
      await loadData();
      addToast({
        type: "success",
        title: "Entry Deleted",
        message: "The sports entry has been deleted successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete sports entry. Please try again.",
      });
      throw err;
    }
  };

  return (
    <div className="ml-64 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="sports"
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
