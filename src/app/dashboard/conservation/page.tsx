"use client";

import React, { useEffect, useState } from "react";
import ConservationTabs from "./components/ConservationTabs";
import { ConservationPageExample } from "./components";
import { TreeEntryData } from "@/lib/conservation/conservation";
import { ConservationApi } from "@/lib/api";
import { treeFromBackend, treeToBackend } from "@/lib/conservation/adapters";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import { ConservationData } from "@/lib/conservation/types";

const initialTreePlantingData: TreeEntryData[] = [];

export default function ConservationPage() {
  const [treeData, setTreeData] = useState<TreeEntryData[]>(
    initialTreePlantingData
  );
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

      const res = await ConservationApi.treePlanting.list(token, queryParams);
      const items =
        (res as any)?.data?.items ||
        (res as any)?.items ||
        (Array.isArray(res) ? res : []);
      const sortedItems = (items as any[]).map(treeFromBackend).sort((a, b) => {
        // Sort by date planted in descending order (latest first)
        const dateA = new Date(a.datePlanted);
        const dateB = new Date(b.datePlanted);
        return dateB.getTime() - dateA.getTime();
      });
      setTreeData(sortedItems);
    } catch (error) {
      addToast({
        type: "error",
        title: "Load Failed",
        message: "Failed to load conservation data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreate = async (data: ConservationData) => {
    if (!token) {
      addToast({
        type: "error",
        title: "Unauthorized",
        message: "Authentication token is required.",
      });
      throw new Error("Authentication token is required");
    }

    // Type guard to ensure we have tree planting data
    if (!("treeType" in data) || !("numberOfTrees" in data)) {
      addToast({
        type: "error",
        title: "Invalid Data",
        message: "Provided data is not a valid tree planting entry.",
      });
      throw new Error("Invalid data type for tree planting");
    }

    // Validate required fields
    const requiredFields = [
      "treeType",
      "location",
      "numberOfTrees",
      "datePlanted",
      "targetBeneficiaries",
      "currentBeneficiaries",
    ];
    const missingFields = requiredFields.filter(
      (field) => !data[field as keyof typeof data]
    );

    if (missingFields.length > 0) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    try {
      const backendData = treeToBackend(data as TreeEntryData);

      // Validate the backend data
      if (
        !backendData.treeType ||
        !backendData.location ||
        !backendData.numberOfTrees ||
        !(backendData as any).datePlanted
      ) {
        addToast({
          type: "error",
          title: "Validation Error",
          message: "Required fields are missing.",
        });
        throw new Error("Backend data validation failed");
      }

      // Validate data types match backend entity
      if (
        typeof backendData.treeType !== "string" ||
        typeof backendData.location !== "string" ||
        typeof backendData.numberOfTrees !== "number" ||
        typeof (backendData as any).datePlanted !== "string" ||
        typeof backendData.targetBeneficiaries !== "number" ||
        typeof backendData.currentBeneficiaries !== "number"
      ) {
        addToast({
          type: "error",
          title: "Validation Error",
          message: "Field types are invalid.",
        });
        throw new Error("Backend data type validation failed");
      }

      const res = await ConservationApi.treePlanting.create(
        token,
        backendData as any
      );

      // Validate the response
      if (!res) {
        throw new Error("No response received from API");
      }

      const created = (res as any)?.data || res;

      if (!created) {
        throw new Error("No data in API response");
      }

      try {
        const processedEntry = treeFromBackend(created);
        const newEntry = processedEntry;
        setTreeData((prev) => [newEntry, ...prev]);

        addToast({
          type: "success",
          title: "Tree Planting Entry Created",
          message: "The tree planting entry has been created successfully.",
        });
      } catch (processingError: any) {
        addToast({
          type: "error",
          title: "Processing Failed",
          message:
            processingError?.message || "Failed to process API response.",
        });
        throw new Error(
          `Failed to process API response: ${
            processingError?.message || "Unknown error"
          }`
        );
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create tree planting entry. Please try again.",
      });

      throw error;
    }
  };

  const handleUpdate = async (data: ConservationData) => {
    if (!token) return;

    // Type guard to ensure we have tree planting data
    if (!("treeType" in data) || !("numberOfTrees" in data)) {
      addToast({
        type: "error",
        title: "Invalid Data",
        message: "Provided data is not a valid tree planting entry.",
      });
      throw new Error("Invalid data type for tree planting");
    }

    try {
      const id = (data as any).id;
      const res = await ConservationApi.treePlanting.update(
        token,
        String(id),
        treeToBackend(data as TreeEntryData) as any
      );
      const updated = (res as any)?.data || res;
      setTreeData((prev) =>
        prev.map((e) => (e.id === String(id) ? treeFromBackend(updated) : e))
      );

      addToast({
        type: "success",
        title: "Tree Planting Entry Updated",
        message: "The tree planting entry has been updated successfully.",
      });
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update tree planting entry. Please try again.",
      });
      throw error;
    }
  };

  const handleDelete = async (data: ConservationData) => {
    if (!token) return;

    // Type guard to ensure we have tree planting data
    if (!("treeType" in data) || !("numberOfTrees" in data)) {
      addToast({
        type: "error",
        title: "Invalid Data",
        message: "Provided data is not a valid tree planting entry.",
      });
      throw new Error("Invalid data type for tree planting");
    }

    try {
      const id = (data as any).id;
      await ConservationApi.treePlanting.remove(token, String(id));
      setTreeData((prev) => prev.filter((e) => e.id !== String(id)));

      addToast({
        type: "success",
        title: "Tree Planting Entry Deleted",
        message: "The tree planting entry has been deleted successfully.",
      });
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete tree planting entry. Please try again.",
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
            conservationType="tree"
            entries={treeData}
            isLoading={loading}
            onCreateEntry={handleCreate}
            onUpdateEntry={handleUpdate}
            onDeleteEntry={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
