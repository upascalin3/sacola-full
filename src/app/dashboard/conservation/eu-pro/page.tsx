"use client";

import React, { useEffect, useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationData, ConservationPageExample } from "../components";
import { EUfundedEntryData } from "@/lib/conservation/conservation";
import { ConservationApi } from "@/lib/api";
import { euFundedFromBackend, euFundedToBackend } from "@/lib/conservation/adapters";
import { useAuth } from "@/lib/auth-context";

const initialEUFundedData: EUfundedEntryData[] = [];

export default function EUProPage() {
  const [euFundedData, setEUFundedData] =
    useState<EUfundedEntryData[]>(initialEUFundedData);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await ConservationApi.euFundedProjects.list(token);
      const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
      setEUFundedData((items as any[]).map(euFundedFromBackend));
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreate = async (data: ConservationData) => {
    if (!token) return;
    const payload = data as unknown as EUfundedEntryData;
    const res = await ConservationApi.euFundedProjects.create(token, euFundedToBackend(payload));
    const created = (res as any)?.data || res;
    setEUFundedData((prev) => [euFundedFromBackend(created), ...prev]);
    await loadData();
  };

  const handleUpdate = async (data: ConservationData) => {
    if (!token) return;
    const payload = data as unknown as EUfundedEntryData;
    const id = (payload as any).id;
    const res = await ConservationApi.euFundedProjects.update(token, String(id), euFundedToBackend(payload));
    const updated = (res as any)?.data || res;
    setEUFundedData((prev) => prev.map((e) => (e.id === String(id) ? euFundedFromBackend(updated) : e)));
    await loadData();
  };

  const handleDelete = async (data: ConservationData) => {
    if (!token) return;
    const id = (data as any).id;
    await ConservationApi.euFundedProjects.remove(token, String(id));
    setEUFundedData((prev) => prev.filter((e) => e.id !== String(id)));
    await loadData();
  };

  if (loading) {
    return (
      <div className="ml-64">
        <div className="max-w-7xl mx-auto">
          <ConservationTabs />
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
