"use client";

import React, { useEffect, useState } from "react";
import ConservationTabs from "../components/ConservationTabs";
import { ConservationData, ConservationPageExample } from "../components";
import { BambooEntryData } from "@/lib/conservation/conservation";
import { ConservationApi } from "@/lib/api";
import {
  bambooFromBackend,
  bambooToBackend,
} from "@/lib/conservation/adapters";
import { useAuth } from "@/lib/auth-context";

const initialBambooData: BambooEntryData[] = [];

export default function BambooPage() {
  const [bambooData, setBambooData] =
    useState<BambooEntryData[]>(initialBambooData);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const loadData = async (filters?: any) => {
    if (!token) return;
    try {
      setLoading(true);
      const queryParams: any = {};

      // Add filters as query parameters
      if (filters) {
        if (filters.location) queryParams.location = filters.location;
        if (filters.startDate) queryParams.startDate = filters.startDate;
        if (filters.endDate) queryParams.endDate = filters.endDate;
        if (filters.page) queryParams.page = filters.page;
        if (filters.limit) queryParams.limit = filters.limit;
      }

      console.log("Loading bamboo data with params:", queryParams);
      const res = await ConservationApi.bamboo.list(token, queryParams);
      const items =
        (res as any)?.data?.items ||
        (res as any)?.items ||
        (Array.isArray(res) ? res : []);
      console.log("Bamboo data received:", items);
      const sortedItems = (items as any[])
        .map(bambooFromBackend)
        .sort((a, b) => {
          // Sort by date donated in descending order (latest first)
          const dateA = new Date(a.dateDonated);
          const dateB = new Date(b.dateDonated);
          return dateB.getTime() - dateA.getTime();
        });
      setBambooData(sortedItems);
    } catch (error) {
      console.error("Failed to load bamboo data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreate = async (data: ConservationData) => {
    if (!token) return;
    try {
      console.log("Creating bamboo entry with data:", data);
      console.log("Data types:", {
        distanceCovered: typeof (data as any).distanceCovered,
        location: typeof (data as any).location,
        datePlanted: typeof (data as any).datePlanted,
        description: typeof (data as any).description,
      });

      const payload = data as unknown as BambooEntryData;
      const backendData = bambooToBackend(payload);
      console.log("Converted to backend format:", backendData);
      console.log("Backend data types:", {
        distanceCovered: typeof backendData.distanceCovered,
        location: typeof backendData.location,
        datePlanted: typeof backendData.datePlanted,
        description: typeof backendData.description,
      });

      const res = await ConservationApi.bamboo.create(token, backendData);
      const created = (res as any)?.data || res;
      const newEntry = bambooFromBackend(created);
      setBambooData((prev) => [newEntry, ...prev]);
    } catch (error) {
      console.error("Failed to create bamboo entry:", error);
      console.error("Error details:", {
        message: (error as any).message,
        stack: (error as any).stack,
        data: data,
      });
      throw error;
    }
  };

  const handleUpdate = async (data: ConservationData) => {
    if (!token) return;
    try {
      const payload = data as unknown as BambooEntryData;
      const id = (payload as any).id;
      const res = await ConservationApi.bamboo.update(
        token,
        String(id),
        bambooToBackend(payload)
      );
      const updated = (res as any)?.data || res;
      setBambooData((prev) =>
        prev.map((e) => (e.id === String(id) ? bambooFromBackend(updated) : e))
      );
      // Reload fresh data from server after update
      await loadData();
    } catch (error) {
      console.error("Failed to update bamboo entry:", error);
      throw error;
    }
  };

  const handleDelete = async (data: ConservationData) => {
    if (!token) return;
    try {
      const id = (data as any).id;
      await ConservationApi.bamboo.remove(token, String(id));
      setBambooData((prev) => prev.filter((e) => e.id !== String(id)));
      // Reload fresh data from server after delete
      await loadData();
    } catch (error) {
      console.error("Failed to delete bamboo entry:", error);
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
            conservationType="bamboo"
            entries={bambooData}
            onCreateEntry={handleCreate}
            onUpdateEntry={handleUpdate}
            onDeleteEntry={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
