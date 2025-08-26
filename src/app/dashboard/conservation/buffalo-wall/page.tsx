"use client";

import React, { useEffect, useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationPageExample } from "../components";
import { buffaloWallEntryData } from "@/lib/conservation/conservation";
import { ConservationApi } from "@/lib/api";
import { buffaloWallFromBackend, buffaloWallToBackend } from "@/lib/conservation/adapters";
import { useAuth } from "@/lib/auth-context";

const initialBuffaloWallData: buffaloWallEntryData[] = [];

export default function BuffaloWallPage() {
  const [buffaloWallData, setBuffaloWallData] = useState<
    buffaloWallEntryData[]
  >(initialBuffaloWallData);
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await ConservationApi.buffaloWall.list(token);
        const items = (res as any)?.data?.items || (res as any)?.items || (Array.isArray(res) ? res : []);
        setBuffaloWallData((items as any[]).map(buffaloWallFromBackend));
      } catch {}
    };
    load();
  }, [token]);

  const handleCreate = async (data: buffaloWallEntryData) => {
    if (!token) return;
    const res = await ConservationApi.buffaloWall.create(token, buffaloWallToBackend(data));
    const created = (res as any)?.data || res;
    setBuffaloWallData((prev) => [buffaloWallFromBackend(created), ...prev]);
  };

  const handleUpdate = async (data: buffaloWallEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    const res = await ConservationApi.buffaloWall.update(token, String(id), buffaloWallToBackend(data));
    const updated = (res as any)?.data || res;
    setBuffaloWallData((prev) => prev.map((e) => (e.id === String(id) ? buffaloWallFromBackend(updated) : e)));
  };

  const handleDelete = async (data: buffaloWallEntryData) => {
    if (!token) return;
    const id = (data as any).id;
    await ConservationApi.buffaloWall.remove(token, String(id));
    setBuffaloWallData((prev) => prev.filter((e) => e.id !== String(id)));
  };

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
