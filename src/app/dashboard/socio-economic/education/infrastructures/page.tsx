"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { educationInfrastructuresEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  eduInfraFromBackend,
  eduInfraToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: educationInfrastructuresEntryData[] = [];

export default function EducationInfrastructuresPage() {
  const [entries, setEntries] =
    useState<educationInfrastructuresEntryData[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { addToast } = useToast();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.educationInfrastructures.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(eduInfraFromBackend));
    } catch (err) {
      addToast({
        type: "error",
        title: "Load Failed",
        message:
          "Failed to load education infrastructures entries. Please try again.",
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
      const payload = eduInfraToBackend(data);
      const res = await SocioEconomicApi.educationInfrastructures.create(
        token,
        payload
      );
      const created = (res as any)?.data || res;
      setEntries((prev) => [eduInfraFromBackend(created), ...prev]);
      await loadData();
      addToast({
        type: "success",
        title: "Entry Created",
        message:
          "The education infrastructure entry has been created successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message:
          "Failed to create education infrastructure entry. Please try again.",
      });
    }
  };

  const handleUpdate = async (data: any) => {
    if (!token) return;
    try {
      const payload = eduInfraToBackend(data);
      const id = String((data as any)?.id || "");
      if (!id) {
        addToast({
          type: "error",
          title: "Update Failed",
          message: "Missing id for education infrastructure update.",
        });
        return;
      }
      const res = await SocioEconomicApi.educationInfrastructures.update(
        token,
        String(id),
        payload as any
      );
      const updated = (res as any)?.data || res;
      setEntries((prev) =>
        prev.map((item) =>
          item.id === String(id) ? eduInfraFromBackend(updated) : item
        )
      );
      await loadData();
      addToast({
        type: "success",
        title: "Entry Updated",
        message:
          "The education infrastructure entry has been updated successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message:
          "Failed to update education infrastructure entry. Please try again.",
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
          message: "Missing id for education infrastructure deletion.",
        });
        return;
      }
      await SocioEconomicApi.educationInfrastructures.remove(token, String(id));
      setEntries((prev) => prev.filter((item) => item.id !== String(id)));
      await loadData();
      addToast({
        type: "success",
        title: "Entry Deleted",
        message:
          "The education infrastructure entry has been deleted successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message:
          "Failed to delete education infrastructure entry. Please try again.",
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
            socioEconomicType="educationInfrastructures"
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
