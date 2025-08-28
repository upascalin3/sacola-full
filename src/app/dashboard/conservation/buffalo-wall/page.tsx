"use client";

import React, { useEffect, useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationPageExample } from "../components";
import { buffaloWallEntryData } from "@/lib/conservation/conservation";
import { ConservationData } from "@/lib/conservation/types";
import { ConservationApi } from "@/lib/api";
import {
  buffaloWallFromBackend,
  buffaloWallToBackend,
} from "@/lib/conservation/adapters";
import { useAuth } from "@/lib/auth-context";

const initialBuffaloWallData: buffaloWallEntryData[] = [];

export default function BuffaloWallPage() {
  const [buffaloWallData, setBuffaloWallData] = useState<
    buffaloWallEntryData[]
  >(initialBuffaloWallData);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await ConservationApi.buffaloWall.list(token);
      const items =
        (res as any)?.data?.items ||
        (res as any)?.items ||
        (Array.isArray(res) ? res : []);
      const sortedItems = (items as any[])
        .map(buffaloWallFromBackend)
        .sort((a, b) => {
          // Sort by date repaired in descending order (latest first)
          const dateA = new Date(a.dateRepaired);
          const dateB = new Date(b.dateRepaired);
          return dateB.getTime() - dateA.getTime();
        });
      setBuffaloWallData(sortedItems);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreate = async (data: ConservationData) => {
    if (!token) return;
    const payload = data as unknown as buffaloWallEntryData;
    const res = await ConservationApi.buffaloWall.create(
      token,
      buffaloWallToBackend(payload)
    );
    const created = (res as any)?.data || res;
    const newEntry = buffaloWallFromBackend(created);
    setBuffaloWallData((prev) => [newEntry, ...prev]);
    await loadData();
  };

  const handleUpdate = async (data: ConservationData) => {
    if (!token) return;
    const payload = data as unknown as buffaloWallEntryData;
    const id = (payload as any).id;
    const res = await ConservationApi.buffaloWall.update(
      token,
      String(id),
      buffaloWallToBackend(payload)
    );
    const updated = (res as any)?.data || res;
    setBuffaloWallData((prev) =>
      prev.map((e) =>
        e.id === String(id) ? buffaloWallFromBackend(updated) : e
      )
    );
    await loadData();
  };

  const handleDelete = async (data: ConservationData) => {
    if (!token) return;
    const id = (data as any).id;
    await ConservationApi.buffaloWall.remove(token, String(id));
    setBuffaloWallData((prev) => prev.filter((e) => e.id !== String(id)));
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
            conservationType="buffaloWall"
            entries={buffaloWallData}
            onCreateEntry={handleCreate}
            onUpdateEntry={handleUpdate}
            onDeleteEntry={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
