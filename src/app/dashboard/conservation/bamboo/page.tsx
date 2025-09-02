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
import { useToast } from "@/components/ui/toast";

const initialBambooData: BambooEntryData[] = [];

export default function BambooPage() {
  const [bambooData, setBambooData] =
    useState<BambooEntryData[]>(initialBambooData);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { addToast } = useToast();

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

      const res = await ConservationApi.bamboo.list(token, queryParams);
      const items =
        (res as any)?.data?.items ||
        (res as any)?.items ||
        (Array.isArray(res) ? res : []);
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
      // Error will be handled by the calling component
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
      const payload = data as unknown as BambooEntryData;
      const backendData = bambooToBackend(payload);

      const res = await ConservationApi.bamboo.create(token, backendData);
      const created = (res as any)?.data || res;
      const newEntry = bambooFromBackend(created);
      setBambooData((prev) => [newEntry, ...prev]);
      
      addToast({
        type: "success",
        title: "Bamboo Entry Created",
        message: "The bamboo entry has been created successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create bamboo entry. Please try again.",
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
      
      addToast({
        type: "success",
        title: "Bamboo Entry Updated",
        message: "The bamboo entry has been updated successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update bamboo entry. Please try again.",
      });
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
      
      addToast({
        type: "success",
        title: "Bamboo Entry Deleted",
        message: "The bamboo entry has been deleted successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete bamboo entry. Please try again.",
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
