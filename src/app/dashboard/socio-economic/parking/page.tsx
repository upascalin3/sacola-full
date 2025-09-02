"use client";

import React, { useEffect, useState } from "react";
import SocioEconomicTabs from "../components/SocioEconomicTabs";
import { SocioEconomicPageExample } from "../components/SocioEconomicPageExample";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  parkingFromBackend,
  parkingToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: any[] = [];

export default function ParkingPage() {
  const [entries, setEntries] = useState<any[]>(initialEntries);
  const { token } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.parking.list(token);
        const items =
          (res as any)?.data?.items ||
          (res as any)?.items ||
          (Array.isArray(res) ? res : []);
        setEntries((items as any[]).map(parkingFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: any) => {
    if (!token) return;
    const res = await SocioEconomicApi.parking.create(
      token,
      parkingToBackend(data)
    );
    const created = (res as any)?.data || res;
    setEntries((prev) => [parkingFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: any) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.parking.update(
      token,
      String(id),
      parkingToBackend(data)
    );
    const updated = (res as any)?.data || res;
    setEntries((prev) =>
      prev.map((e: any) =>
        e.id === String(id) ? parkingFromBackend(updated) : e
      )
    );
  };

  const handleDelete = async (data: any) => {
    if (!token) return;
    const id = (data as any).id;
    try {
      await SocioEconomicApi.parking.remove(token, String(id));
      setEntries((prev) => prev.filter((e: any) => e.id !== String(id)));
      addToast({
        type: "success",
        title: "Entry Deleted",
        message: "The parking entry has been deleted successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete parking entry. Please try again.",
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
            socioEconomicType="parking"
            entries={entries as any}
            onCreateEntry={handleCreate as any}
            onUpdateEntry={handleUpdate as any}
            onDeleteEntry={handleDelete as any}
          />
        </div>
      </div>
    </div>
  );
}
