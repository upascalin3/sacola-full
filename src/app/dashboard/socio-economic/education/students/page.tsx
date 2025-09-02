"use client";

import React, { useEffect, useState } from "react";
import {
  SocioEconomicTabs,
  SocioEconomicPageExample,
  ArchiveConfirmationModal,
} from "../../components";
import type { educationStudentsEntryData } from "@/lib/socio-economic/socio-economic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  eduStudentsFromBackend,
  eduStudentsToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: educationStudentsEntryData[] = [];

export default function EducationStudentsPage() {
  const [entries, setEntries] =
    useState<educationStudentsEntryData[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<educationStudentsEntryData | null>(null);
  const { token } = useAuth();
  const { addToast } = useToast();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.educationStudents.list(token);
      const payload = res as any;
      const items = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.items ||
          payload?.items ||
          (Array.isArray(payload) ? payload : []);
      setEntries((items as any[]).map(eduStudentsFromBackend));
    } catch (err) {
      addToast({
        type: "error",
        title: "Load Failed",
        message: "Failed to load student entries. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  useEffect(() => {
    const onFocus = () => loadData();
    const onVisibility = () => {
      if (document.visibilityState === "visible") loadData();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [token]);

  const handleCreate = async (data: any) => {
    if (!token) return;
    try {
      const payload = eduStudentsToBackend(data);
      const res = await SocioEconomicApi.educationStudents.create(
        token,
        payload
      );
      const created = (res as any)?.data || res;
      setEntries((prev) => [eduStudentsFromBackend(created), ...prev]);
      await loadData();

      addToast({
        type: "success",
        title: "Student Entry Created",
        message: "The student entry has been created successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: "Failed to create student entry. Please try again.",
      });
    }
  };

  const handleUpdate = async (data: any) => {
    if (!token) return;
    try {
      const payload = eduStudentsToBackend(data);
      const id = String((data as any)?.id || "");
      if (!id) {
        addToast({
          type: "error",
          title: "Update Failed",
          message: "Missing id for student update.",
        });
        return;
      }
      const res = await SocioEconomicApi.educationStudents.update(
        token,
        String(id),
        payload as any
      );
      const updated = (res as any)?.data || res;
      setEntries((prev) =>
        prev.map((item) =>
          item.id === String(id) ? eduStudentsFromBackend(updated) : item
        )
      );
      await loadData();

      addToast({
        type: "success",
        title: "Student Entry Updated",
        message: "The student entry has been updated successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update student entry. Please try again.",
      });
    }
  };

  const handleDelete = async (entry: educationStudentsEntryData) => {
    if (!token) return;
    try {
      await SocioEconomicApi.educationStudents.remove(token, String(entry.id));
      // Remove the deleted student from the current list instead of reloading
      setEntries((prev) => prev.filter((item) => item.id !== entry.id));

      addToast({
        type: "success",
        title: "Student Entry Deleted",
        message: "The student entry has been deleted successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete student entry. Please try again.",
      });
    }
  };

  const handleArchive = async (entry: educationStudentsEntryData) => {
    if (!token) return;
    try {
      const response = await SocioEconomicApi.educationStudents.archive(
        token,
        String(entry.id)
      );
      // Remove the archived student from the current list instead of reloading
      setEntries((prev) => prev.filter((item) => item.id !== entry.id));

      // Reload data after a short delay to ensure backend has processed the archive
      setTimeout(() => {
        loadData();
      }, 1000);

      addToast({
        type: "success",
        title: "Student Entry Archived",
        message: "The student entry has been archived successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Archive Failed",
        message: "Failed to archive student entry. Please try again.",
      });
      // Don't remove from list if archive failed
    }
  };

  const openArchiveModal = (entry: educationStudentsEntryData) => {
    setSelectedEntry(entry);
    setShowArchiveModal(true);
  };

  const confirmArchive = () => {
    if (selectedEntry) {
      handleArchive(selectedEntry);
    }
    setShowArchiveModal(false);
    setSelectedEntry(null);
  };

  if (loading) {
    return (
      <div className="ml-64 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SocioEconomicTabs />
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
        <SocioEconomicTabs />
        <div className="p-8">
          <div className="mb-6">
            <Link href="/dashboard/socio-economic/education/students/archived">
              <Button variant="outline" className="flex items-center gap-2">
                <Archive size={16} />
                View Archived Students
              </Button>
            </Link>
          </div>
          <SocioEconomicPageExample
            socioEconomicType="educationStudents"
            entries={entries}
            onCreateEntry={handleCreate}
            onUpdateEntry={handleUpdate}
            showAddButton={true}
            enableEdit={true}
            enableDelete={true}
            showArchive={true}
            onArchiveEntry={(d) =>
              openArchiveModal(d as educationStudentsEntryData)
            }
            onDeleteEntry={(d) => handleDelete(d as educationStudentsEntryData)}
          />
        </div>
      </div>

      <ArchiveConfirmationModal
        isOpen={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setSelectedEntry(null);
        }}
        onConfirm={confirmArchive}
        socioEconomicType="educationStudents"
        itemName={selectedEntry?.studentName}
      />
    </div>
  );
}
