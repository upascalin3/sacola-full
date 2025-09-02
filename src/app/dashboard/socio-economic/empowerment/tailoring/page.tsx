"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { empowermentTailoringEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  empowermentTailoringFromBackend,
  empowermentTailoringToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: empowermentTailoringEntryData[] = [];

export default function EmpowermentTailoringPage() {
  const [entries, setEntries] =
    useState<empowermentTailoringEntryData[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { addToast } = useToast();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.empowermentTailoring.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(empowermentTailoringFromBackend));
    } catch (err) {
      addToast({
        type: "error",
        title: "Load Failed",
        message: "Failed to load tailoring entries. Please try again.",
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

  const handleCreate = async (data: any) => {
    if (!token) return;
    try {
      const payload = empowermentTailoringToBackend(data);
      const res = await SocioEconomicApi.empowermentTailoring.create(
        token,
        payload
      );
      const created = (res as any)?.data || res;
      setEntries((prev) => [empowermentTailoringFromBackend(created), ...prev]);
      await loadData();
      addToast({
        type: "success",
        title: "Entry Created",
        message: "The tailoring entry has been created successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create tailoring entry. Please try again.",
      });
    }
  };

  const handleUpdate = async (data: any) => {
    if (!token) return;
    try {
      const payload = empowermentTailoringToBackend(data);
      const id = String((data as any)?.id || "");
      if (!id) {
        addToast({
          type: "error",
          title: "Update Failed",
          message: "Missing id for tailoring update.",
        });
        return;
      }
      const res = await SocioEconomicApi.empowermentTailoring.update(
        token,
        String(id),
        payload as any
      );
      const updated = (res as any)?.data || res;
      setEntries((prev) =>
        prev.map((item) =>
          item.id === String(id)
            ? empowermentTailoringFromBackend(updated)
            : item
        )
      );
      await loadData();
      addToast({
        type: "success",
        title: "Entry Updated",
        message: "The tailoring entry has been updated successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update tailoring entry. Please try again.",
      });
    }
  };

  const handleDelete = async (data: any) => {
    if (!token) return;
    try {
      const id = String((data as any)?.id || "");
      if (!id) {
        addToast({
          type: "error",
          title: "Deletion Failed",
          message: "Missing id for tailoring deletion.",
        });
        return;
      }
      await SocioEconomicApi.empowermentTailoring.remove(token, String(id));
      setEntries((prev) => prev.filter((item) => item.id !== String(id)));
      await loadData();
      addToast({
        type: "success",
        title: "Entry Deleted",
        message: "The tailoring entry has been deleted successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete tailoring entry. Please try again.",
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
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="empowermentTailoring"
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
