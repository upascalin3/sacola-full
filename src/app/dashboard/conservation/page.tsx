"use client";

import React, { useEffect, useState } from "react";
import ConservationTabs from "./components/ConservationTabs";
import { ConservationPageExample } from "./components";
import { TreeEntryData } from "@/lib/conservation/conservation";
import { ConservationApi } from "@/lib/api";
import { treeFromBackend, treeToBackend } from "@/lib/conservation/adapters";
import { useAuth } from "@/lib/auth-context";
import { ConservationData } from "@/lib/conservation/types";

const initialTreePlantingData: TreeEntryData[] = [];

export default function ConservationPage() {
  const [treeData, setTreeData] = useState<TreeEntryData[]>(
    initialTreePlantingData
  );
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
      console.error("Failed to load tree planting data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreate = async (data: ConservationData) => {
    if (!token) {
      console.error("No authentication token available");
      throw new Error("Authentication token is required");
    }

    console.log("Token available:", !!token);
    console.log("Token length:", token?.length);

    // Type guard to ensure we have tree planting data
    if (!("treeType" in data) || !("numberOfTrees" in data)) {
      console.error("Invalid data type for tree planting:", data);
      console.error("Available fields:", Object.keys(data));
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
      console.error("Missing required fields:", missingFields);
      console.error("Available fields:", Object.keys(data));
      console.error(
        "Field values:",
        requiredFields.map((field) => ({
          field,
          value: data[field as keyof typeof data],
          exists: field in data,
        }))
      );
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Log the exact data structure being received
    console.log("Received form data structure:", {
      treeType: {
        value: data.treeType,
        type: typeof data.treeType,
        exists: "treeType" in data,
      },
      location: {
        value: data.location,
        type: typeof data.location,
        exists: "location" in data,
      },
      numberOfTrees: {
        value: data.numberOfTrees,
        type: typeof data.numberOfTrees,
        exists: "numberOfTrees" in data,
      },
      datePlanted: {
        value: data.datePlanted,
        type: typeof data.datePlanted,
        exists: "datePlanted" in data,
      },
      targetBeneficiaries: {
        value: data.targetBeneficiaries,
        type: typeof data.targetBeneficiaries,
        exists: "targetBeneficiaries" in data,
      },
      currentBeneficiaries: {
        value: data.currentBeneficiaries,
        type: typeof data.currentBeneficiaries,
        exists: "currentBeneficiaries" in data,
      },
      description: {
        value: data.description,
        type: typeof data.description,
        exists: "description" in data,
      },
    });

    // Add date debugging as per SOLUTION 13
    console.log("=== DATE DEBUGGING ===");
    console.log("Original datePlanted:", data.datePlanted);
    console.log("Type of datePlanted:", typeof data.datePlanted);
    console.log("Is Date instance:", data.datePlanted instanceof Date);

    if (data.datePlanted instanceof Date) {
      console.log("Date methods:");
      console.log("- getTime():", data.datePlanted.getTime());
      console.log("- toISOString():", data.datePlanted.toISOString());
      console.log("- toString():", data.datePlanted.toString());
      console.log("- toDateString():", data.datePlanted.toDateString());
      console.log("- ISO format:", data.datePlanted.toISOString());
    }
    console.log("=====================");

    try {
      console.log("Creating tree planting entry with data:", data);
      console.log("Data types:", {
        treeType: typeof data.treeType,
        location: typeof data.location,
        numberOfTrees: typeof data.numberOfTrees,
        datePlanted: typeof data.datePlanted,
        datePlantedValue: data.datePlanted,
        datePlantedInstance: data.datePlanted instanceof Date,
        targetBeneficiaries: typeof data.targetBeneficiaries,
        currentBeneficiaries: typeof data.currentBeneficiaries,
        description: typeof data.description,
      });

      const backendData = treeToBackend(data as TreeEntryData);
      console.log("Converted to backend format:", backendData);
      console.log("Backend data types:", {
        treeType: typeof backendData.treeType,
        location: typeof backendData.location,
        numberOfTrees: typeof backendData.numberOfTrees,
        datePlanted: typeof (backendData as any).datePlanted,
        datePlantedValue: (backendData as any).datePlanted,
        targetBeneficiaries: typeof backendData.targetBeneficiaries,
        currentBeneficiaries: typeof backendData.currentBeneficiaries,
        description: typeof backendData.description,
      });

      // Validate the backend data
      if (
        !backendData.treeType ||
        !backendData.location ||
        !backendData.numberOfTrees ||
        !(backendData as any).datePlanted
      ) {
        console.error("Backend data validation failed:", backendData);
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
        console.error("Backend data type validation failed:", {
          treeType: {
            value: backendData.treeType,
            type: typeof backendData.treeType,
            expected: "string",
          },
          location: {
            value: backendData.location,
            type: typeof backendData.location,
            expected: "string",
          },
          numberOfTrees: {
            value: backendData.numberOfTrees,
            type: typeof backendData.numberOfTrees,
            expected: "number",
          },
          datePlanted: {
            value: (backendData as any).datePlanted,
            type: typeof (backendData as any).datePlanted,
            expected: "string (YYYY-MM-DD)",
          },
          targetBeneficiaries: {
            value: backendData.targetBeneficiaries,
            type: typeof backendData.targetBeneficiaries,
            expected: "number",
          },
          currentBeneficiaries: {
            value: backendData.currentBeneficiaries,
            type: typeof backendData.currentBeneficiaries,
            expected: "number",
          },
        });
        throw new Error("Backend data type validation failed");
      }

      console.log("Making API call to create tree planting entry...");
      console.log("API endpoint:", "/api/conservation/tree-planting");
      console.log("Request payload:", backendData);
      console.log(
        "Request payload JSON:",
        JSON.stringify(backendData, null, 2)
      );

      // Log what the backend entity expects vs what we're sending
      console.log("Backend entity expects:", {
        treeType: "string",
        location: "string",
        numberOfTrees: "number",
        datePlanted: "string (YYYY-MM-DD)",
        description: "string (optional)",
        targetBeneficiaries: "number",
        currentBeneficiaries: "number",
      });

      console.log("What we're sending:", {
        treeType: {
          value: backendData.treeType,
          type: typeof backendData.treeType,
        },
        location: {
          value: backendData.location,
          type: typeof backendData.location,
        },
        numberOfTrees: {
          value: backendData.numberOfTrees,
          type: typeof backendData.numberOfTrees,
        },
        datePlanted: {
          value: (backendData as any).datePlanted,
          type: typeof (backendData as any).datePlanted,
          format: (backendData as any).datePlanted,
        },
        description: {
          value: backendData.description,
          type: typeof backendData.description,
        },
        targetBeneficiaries: {
          value: backendData.targetBeneficiaries,
          type: typeof backendData.targetBeneficiaries,
        },
        currentBeneficiaries: {
          value: backendData.currentBeneficiaries,
          type: typeof backendData.currentBeneficiaries,
        },
      });

      const res = await ConservationApi.treePlanting.create(
        token,
        backendData as any
      );
      console.log("API response received:", res);

      // Validate the response
      if (!res) {
        throw new Error("No response received from API");
      }

      const created = (res as any)?.data || res;
      console.log("Processed response data:", created);

      if (!created) {
        throw new Error("No data in API response");
      }

      try {
        const processedEntry = treeFromBackend(created);
        console.log("Processed entry:", processedEntry);
        const newEntry = processedEntry;
        setTreeData((prev) => [newEntry, ...prev]);
        // Reload fresh data from server after create
        await loadData();
      } catch (processingError: any) {
        console.error("Error processing API response:", processingError);
        throw new Error(
          `Failed to process API response: ${
            processingError?.message || "Unknown error"
          }`
        );
      }
    } catch (error: any) {
      console.error("Failed to create tree planting entry:", error);
      console.error("Error details:", {
        message: error?.message || "Unknown error",
        stack: error?.stack || "No stack trace",
        data: data,
        errorType: typeof error,
        errorKeys: error ? Object.keys(error) : [],
        fullError: error,
        response: error?.response,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data,
      });

      // Re-throw with more context if it's an empty error
      if (!error?.message && !error?.response) {
        const enhancedError = new Error(
          "Failed to create tree planting entry - unknown error occurred"
        );
        (enhancedError as any).originalError = error;
        (enhancedError as any).formData = data;
        throw enhancedError;
      }

      // Check for specific HTTP status codes
      if (error?.status) {
        switch (error.status) {
          case 400:
            console.error("Bad request - check your data format");
            break;
          case 401:
            console.error("Unauthorized - check your authentication token");
            break;
          case 403:
            console.error(
              "Forbidden - you may not have permission to create entries"
            );
            break;
          case 404:
            console.error("API endpoint not found - check the URL");
            break;
          case 500:
            console.error("Internal server error - backend issue");
            break;
          default:
            console.error(
              `HTTP ${error.status}: ${error.statusText || "Unknown error"}`
            );
        }
      }

      throw error;
    }
  };

  const handleUpdate = async (data: ConservationData) => {
    if (!token) return;

    // Type guard to ensure we have tree planting data
    if (!("treeType" in data) || !("numberOfTrees" in data)) {
      console.error("Invalid data type for tree planting:", data);
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
      // Reload fresh data from server after update
      await loadData();
    } catch (error: any) {
      console.error("Failed to update tree planting entry:", error);
      throw error;
    }
  };

  const handleDelete = async (data: ConservationData) => {
    if (!token) return;

    // Type guard to ensure we have tree planting data
    if (!("treeType" in data) || !("numberOfTrees" in data)) {
      console.error("Invalid data type for tree planting:", data);
      throw new Error("Invalid data type for tree planting");
    }

    try {
      const id = (data as any).id;
      await ConservationApi.treePlanting.remove(token, String(id));
      setTreeData((prev) => prev.filter((e) => e.id !== String(id)));
      // Reload fresh data from server after delete
      await loadData();
    } catch (error: any) {
      console.error("Failed to delete tree planting entry:", error);
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
