"use client";

import React, { useEffect, useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationData, ConservationPageExample } from "../components";
import { WaterTanksEntryData } from "@/lib/conservation/conservation";
import { ConservationApi } from "@/lib/api";
import {
  waterTanksFromBackend,
  waterTanksToBackend,
} from "@/lib/conservation/adapters";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";

const initialWaterTankData: WaterTanksEntryData[] = [];

export default function WaterTanksPage() {
  const [waterTankData, setWaterTankData] =
    useState<WaterTanksEntryData[]>(initialWaterTankData);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await ConservationApi.waterTanks.list(token);
        const items =
          (res as any)?.data?.items ||
          (res as any)?.items ||
          (Array.isArray(res) ? res : []);
        const sortedItems = (items as any[])
          .map(waterTanksFromBackend)
          .sort((a, b) => {
            // Sort by date donated in descending order (latest first)
            const dateA = new Date(a.dateDonated);
            const dateB = new Date(b.dateDonated);
            return dateB.getTime() - dateA.getTime();
          });
        setWaterTankData(sortedItems);
      } catch (error) {
        addToast({
          type: "error",
          title: "Load Failed",
          message: "Failed to load water tank entries. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleCreate = async (data: ConservationData) => {
    if (!token) return;
    try {
      const payload = data as unknown as WaterTanksEntryData;
      const res = await ConservationApi.waterTanks.create(
        token,
        waterTanksToBackend(payload)
      );
      const created = (res as any)?.data || res;
      const newEntry = waterTanksFromBackend(created);
      setWaterTankData((prev) => [newEntry, ...prev]);
      addToast({
        type: "success",
        title: "Water Tank Entry Created",
        message: "The water tank entry has been created successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create water tank entry. Please try again.",
      });
      throw error;
    }
  };

  const handleUpdate = async (data: ConservationData) => {
    if (!token) return;
    try {
      const payload = data as unknown as WaterTanksEntryData;
      const id = (payload as any).id;
      const res = await ConservationApi.waterTanks.update(
        token,
        String(id),
        waterTanksToBackend(payload)
      );
      const updated = (res as any)?.data || res;
      setWaterTankData((prev) =>
        prev.map((e) =>
          e.id === String(id) ? waterTanksFromBackend(updated) : e
        )
      );
      addToast({
        type: "success",
        title: "Water Tank Entry Updated",
        message: "The water tank entry has been updated successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update water tank entry. Please try again.",
      });
      throw error;
    }
  };

  const handleDelete = async (data: ConservationData) => {
    if (!token) return;
    try {
      const id = (data as any).id;
      await ConservationApi.waterTanks.remove(token, String(id));
      setWaterTankData((prev) => prev.filter((e) => e.id !== String(id)));
      addToast({
        type: "success",
        title: "Water Tank Entry Deleted",
        message: "The water tank entry has been deleted successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete water tank entry. Please try again.",
      });
      throw error;
    }
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
            conservationType="waterTanks"
            entries={waterTankData}
            onCreateEntry={handleCreate}
            onUpdateEntry={handleUpdate}
            onDeleteEntry={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
