"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../../components";
import type { empowermentMicroFinanceEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  empowermentMicroFinanceFromBackend,
  empowermentMicroFinanceToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: empowermentMicroFinanceEntryData[] = [];

export default function EmpowermentMicroFinancePage() {
  const [entries, setEntries] =
    useState<empowermentMicroFinanceEntryData[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.empowermentMicroFinance.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(empowermentMicroFinanceFromBackend));
    } catch (err) {
      console.error("Failed to load Micro Finance entries", err);
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

  const handleCreate = async (data: empowermentMicroFinanceEntryData) => {
    if (!token) return;
    try {
      const res = await SocioEconomicApi.empowermentMicroFinance.create(
        token,
        empowermentMicroFinanceToBackend(data)
      );
      const created = (res as any)?.data || res;
      setEntries((prev) => [
        empowermentMicroFinanceFromBackend(created),
        ...prev,
      ]);
      await loadData();
    } catch (err) {
      console.error("Failed to create Micro Finance entry", err);
    }
  };

  const handleUpdate = async (data: empowermentMicroFinanceEntryData) => {
    if (!token) return;
    try {
      const id = String((data as any)?.id || "");
      if (!id) {
        console.error("Missing id for Micro Finance update; aborting");
        return;
      }
      const res = await SocioEconomicApi.empowermentMicroFinance.update(
        token,
        String(id),
        empowermentMicroFinanceToBackend(data)
      );
      const updated = (res as any)?.data || res;
      setEntries((prev) =>
        prev.map((e) =>
          e.id === String(id) ? empowermentMicroFinanceFromBackend(updated) : e
        )
      );
      await loadData();
    } catch (err) {
      console.error("Failed to update Micro Finance entry", err);
    }
  };

  const handleDelete = async (data: empowermentMicroFinanceEntryData) => {
    if (!token) return;
    try {
      const id = String((data as any)?.id || "");
      if (!id) {
        console.error("Missing id for Micro Finance delete; aborting");
        return;
      }
      await SocioEconomicApi.empowermentMicroFinance.remove(token, String(id));
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));
      await loadData();
    } catch (err) {
      console.error("Failed to delete Micro Finance entry", err);
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
            socioEconomicType="empowermentMicroFinance"
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
