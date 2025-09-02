"use client";

import React, { useEffect, useState } from "react";
import {
  SocioEconomicTabs,
  SocioEconomicPageExample,
  UnarchiveConfirmationModal,
  DeleteConfirmationModal,
} from "../../../components";
import type { educationStudentsEntryData } from "@/lib/socio-economic/socio-economic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { SocioEconomicApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  eduStudentsFromBackend,
  eduStudentsToBackend,
} from "@/lib/socio-economic/adapters";

const initialEntries: educationStudentsEntryData[] = [];

export default function ArchivedStudentsPage() {
  const [entries, setEntries] =
    useState<educationStudentsEntryData[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<educationStudentsEntryData | null>(null);
  const { token } = useAuth();
  const { addToast } = useToast();

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await SocioEconomicApi.educationStudents.archived(token);
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
        message: "Failed to load archived students. Please try again.",
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

  const handleUnarchive = async (entry: educationStudentsEntryData) => {
    if (!token) return;
    try {
      const response = await SocioEconomicApi.educationStudents.unarchive(
        token,
        String(entry.id)
      );
      // Remove the unarchived student from the current list instead of reloading
      setEntries((prev) => prev.filter((item) => item.id !== entry.id));

      // Reload data after a short delay to ensure backend has processed the unarchive
      setTimeout(() => {
        loadData();
      }, 1000);

      addToast({
        type: "success",
        title: "Student Unarchived",
        message: "The student entry has been unarchived successfully.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Unarchive Failed",
        message: "Failed to unarchive student entry. Please try again.",
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

  const openUnarchiveModal = (entry: educationStudentsEntryData) => {
    setSelectedEntry(entry);
    setShowUnarchiveModal(true);
  };

  const openDeleteModal = (entry: educationStudentsEntryData) => {
    setSelectedEntry(entry);
    setShowDeleteModal(true);
  };

  const confirmUnarchive = () => {
    if (selectedEntry) {
      handleUnarchive(selectedEntry);
    }
    setShowUnarchiveModal(false);
    setSelectedEntry(null);
  };

  const confirmDelete = () => {
    if (selectedEntry) {
      handleDelete(selectedEntry);
    }
    setShowDeleteModal(false);
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
            <Link href="/dashboard/socio-economic/education/students">
              <Button variant="outline" className="flex items-center gap-2">
                <Users size={16} />
                Back to Supported Students
              </Button>
            </Link>
          </div>
          <SocioEconomicPageExample
            socioEconomicType="educationStudents"
            entries={entries}
            showAddButton={false}
            enableEdit={false}
            enableDelete={true}
            showUnarchive={true}
            onUnarchiveEntry={async (d) =>
              openUnarchiveModal(d as educationStudentsEntryData)
            }
            onDeleteEntry={async (d) =>
              openDeleteModal(d as educationStudentsEntryData)
            }
          />
        </div>
      </div>

      <UnarchiveConfirmationModal
        isOpen={showUnarchiveModal}
        onClose={() => {
          setShowUnarchiveModal(false);
          setSelectedEntry(null);
        }}
        onConfirm={confirmUnarchive}
        socioEconomicType="educationStudents"
        itemName={selectedEntry?.studentName}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEntry(null);
        }}
        onConfirm={confirmDelete}
        socioEconomicType="educationStudents"
        itemName={selectedEntry?.studentName}
      />
    </div>
  );
}
