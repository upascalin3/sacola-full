"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "./components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "./components/SocioEconomicPageExample";
import type { LivestockEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  livestockFromBackend,
  livestockToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: LivestockEntryData[] = [];

export default function SocioEconomicPage() {
  const [entries, setEntries] = useState<LivestockEntryData[]>(initialEntries);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.livestock.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(livestockFromBackend));
    } catch (err) {
      addToast({
        type: "error",
        title: "Load Failed",
        message: "Failed to load livestock entries. Please try again.",
      });
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

  const handleCreate = async (data: LivestockEntryData) => {
    if (!token) return;
    try {
      const payload = livestockToBackend(data);
      const res = await SocioEconomicApi.livestock.create(token, payload);
      const created = (res as any)?.data || res;
      setEntries((prev) => [livestockFromBackend(created), ...prev]);
      await loadData();
      addToast({
        type: "success",
        title: "Entry Created",
        message: "The livestock entry has been created successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create livestock entry. Please try again.",
      });
    }
  };

  const handleUpdate = async (data: LivestockEntryData) => {
    if (!token) return;
    try {
      const payload = livestockToBackend(data);
      const id = String((data as any)?.id || "");
      if (!id) {
        addToast({
          type: "error",
          title: "Update Failed",
          message: "Missing id for livestock update.",
        });
        return;
      }
      const res = await SocioEconomicApi.livestock.update(
        token,
        String(id),
        payload as any
      );
      const updated = (res as any)?.data || res;
      setEntries((prev) =>
        prev.map((item) =>
          item.id === String(id) ? livestockFromBackend(updated) : item
        )
      );
      await loadData();
      addToast({
        type: "success",
        title: "Entry Updated",
        message: "The livestock entry has been updated successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update livestock entry. Please try again.",
      });
    }
  };

  const handleDelete = async (data: LivestockEntryData) => {
    if (!token) return;
    try {
      const id = String((data as any)?.id || "");
      if (!id) {
        addToast({
          type: "error",
          title: "Deletion Failed",
          message: "Missing id for livestock deletion.",
        });
        return;
      }
      await SocioEconomicApi.livestock.remove(token, String(id));
      setEntries((prev) => prev.filter((item) => item.id !== String(id)));
      await loadData();
      addToast({
        type: "success",
        title: "Entry Deleted",
        message: "The livestock entry has been deleted successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete livestock entry. Please try again.",
      });
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
    <div className="ml-64 overflow-hidden">
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
