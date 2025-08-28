"use client";

import React, { useEffect, useState } from "react";
import { SocioEconomicTabs, SocioEconomicPageExample } from "../components";
import { waterPumpsEntryData } from "@/lib/socio-economic/socio-economic";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  waterPumpsFromBackend,
  waterPumpsToBackend,
} from "@/lib/socio-economic/adapters";

const initialWaterPumpsData: waterPumpsEntryData[] = [];

export default function WaterPumpsPage() {
  const [waterPumpsData, setWaterPumpsData] = useState<waterPumpsEntryData[]>(
    initialWaterPumpsData
  );
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await SocioEconomicApi.waterPumps.list(token);
        const items =
          (res as any)?.data?.items ||
          (res as any)?.items ||
          (Array.isArray(res) ? res : []);
        setWaterPumpsData((items as any[]).map(waterPumpsFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: waterPumpsEntryData) => {
    if (!token) return;
    const res = await SocioEconomicApi.waterPumps.create(
      token,
      waterPumpsToBackend(data)
    );
    const created = (res as any)?.data || res;
    setWaterPumpsData((prev) => [waterPumpsFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: waterPumpsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await SocioEconomicApi.waterPumps.update(
      token,
      String(id),
      waterPumpsToBackend(data)
    );
    const updated = (res as any)?.data || res;
    setWaterPumpsData((prev) =>
      prev.map((e) =>
        e.id === String(id) ? waterPumpsFromBackend(updated) : e
      )
    );
  };

  const handleDelete = async (data: waterPumpsEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await SocioEconomicApi.waterPumps.remove(token, String(id));
    setWaterPumpsData((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <SocioEconomicPageExample
            socioEconomicType="waterPumps"
            entries={waterPumpsData}
            onCreateEntry={handleCreate}
            onUpdateEntry={handleUpdate}
            onDeleteEntry={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
