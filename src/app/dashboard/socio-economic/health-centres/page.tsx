"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import type { healthCentresEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  healthCentreFromBackend,
  healthCentreToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: healthCentresEntryData[] = [];

export default function HealthCentresPage() {
  const [entries, setEntries] =
    useState<healthCentresEntryData[]>(initialEntries);
  const { token } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.healthCentres.list(token);
        const payload = res as any;
        const items = Array.isArray(payload?.data)
          ? payload.data
          : payload?.data?.items ||
            payload?.items ||
            (Array.isArray(payload) ? payload : []);
        setEntries((items as any[]).map(healthCentreFromBackend));
      } catch (err) {
        addToast({
          type: "error",
          title: "Load Failed",
          message: "Failed to load health centres. Please try again.",
        });
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState === "visible") {
        (async () => {
          const res = await SocioEconomicApi.healthCentres.list(
            token as string
          );
          const items =
            (res as any)?.data?.items ||
            (res as any)?.items ||
            (Array.isArray(res) ? res : []);
          setEntries((items as any[]).map(healthCentreFromBackend));
        })();
      }
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [token]);

  const handleCreate = async (data: healthCentresEntryData) => {
    if (!token) return;
    try {
      const res = await SocioEconomicApi.healthCentres.create(
        token,
        healthCentreToBackend(data)
      );
      const created = (res as any)?.data || res;
      setEntries((prev) => [healthCentreFromBackend(created), ...prev]);
      const resList = await SocioEconomicApi.healthCentres.list(token);
      const payload = resList as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(healthCentreFromBackend));
      addToast({
        type: "success",
        title: "Entry Created",
        message: "The health centre entry has been created successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create health centre entry. Please try again.",
      });
    }
  };

  const handleUpdate = async (data: healthCentresEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Missing id for health centre update.",
      });
      return;
    }
    try {
      const res = await SocioEconomicApi.healthCentres.update(
        token,
        String(id),
        healthCentreToBackend(data) as any
      );
      const updated = (res as any)?.data || res;
      setEntries((prev) =>
        prev.map((e) =>
          e.id === String(id) ? healthCentreFromBackend(updated) : e
        )
      );
      const resList = await SocioEconomicApi.healthCentres.list(
        token as string
      );
      const payload = resList as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(healthCentreFromBackend));
      addToast({
        type: "success",
        title: "Entry Updated",
        message: "The health centre entry has been updated successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update health centre entry. Please try again.",
      });
    }
  };

  const handleDelete = async (data: healthCentresEntryData) => {
    if (!token) return;
    const id = String((data as any)?.id || "");
    if (!id) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Missing id for health centre deletion.",
      });
      return;
    }
    try {
      await SocioEconomicApi.healthCentres.remove(token, String(id));
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));
      const resList = await SocioEconomicApi.healthCentres.list(
        token as string
      );
      const payload = resList as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(healthCentreFromBackend));
      addToast({
        type: "success",
        title: "Entry Deleted",
        message: "The health centre entry has been deleted successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete health centre entry. Please try again.",
      });
    }
  };

  return (
    <div className="ml-64 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="healthCentres"
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
