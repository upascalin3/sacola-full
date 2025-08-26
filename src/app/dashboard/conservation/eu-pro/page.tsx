"use client";

import React, { useEffect, useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationPageExample } from "../components";
import { EUfundedEntryData } from "@/lib/conservation/conservation";
import { ConservationApi } from "@/lib/api";
import { euFundedFromBackend, euFundedToBackend } from "@/lib/conservation/adapters";
import { useAuth } from "@/lib/auth-context";

const initialEUFundedData: EUfundedEntryData[] = [];

export default function EUProPage() {
  const [euFundedData, setEUFundedData] =
    useState<EUfundedEntryData[]>(initialEUFundedData);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await ConservationApi.euFundedProjects.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setEUFundedData((items as any[]).map(euFundedFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: EUfundedEntryData) => {
    if (!token) return;
    const res = await ConservationApi.euFundedProjects.create(token, euFundedToBackend(data));
    const created = (res as any)?.data || res;
    setEUFundedData((prev) => [euFundedFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: EUfundedEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await ConservationApi.euFundedProjects.update(token, String(id), euFundedToBackend(data));
    const updated = (res as any)?.data || res;
    setEUFundedData((prev) => prev.map((e) => (e.id === String(id) ? euFundedFromBackend(updated) : e)));
  };

  const handleDelete = async (data: EUfundedEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await ConservationApi.euFundedProjects.remove(token, String(id));
    setEUFundedData((prev) => prev.filter((e) => e.id !== String(id)));
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <ConservationTabs />
        <div className="p-8">
          <ConservationPageExample
            conservationType="euFunded"
            entries={euFundedData}
            onCreateEntry={handleCreate}
            onUpdateEntry={handleUpdate}
            onDeleteEntry={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
