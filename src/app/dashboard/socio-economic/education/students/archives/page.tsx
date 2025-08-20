"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, ArchiveX, Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { SocioEconomicTabs } from "../../../components";
import { DetailsModal, DeleteConfirmationModal } from "../../../components";
import { educationStudentsEntryData } from "@/lib/socio-economic/socio-economic";
import SearchAndFilters from "../../../components/SearchAndFilters";
import Pagination from "../../../components/Pagination";

const ACTIVE_KEY = "educationStudentsActive";
const ARCHIVE_KEY = "educationStudentsArchive";

function loadActive(): educationStudentsEntryData[] {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as educationStudentsEntryData[];
  } catch {
    return [];
  }
}

function saveActive(data: educationStudentsEntryData[]) {
  try {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(data));
  } catch {}
}

function loadArchive(): educationStudentsEntryData[] {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as educationStudentsEntryData[];
  } catch {
    return [];
  }
}

function saveArchive(data: educationStudentsEntryData[]) {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(data));
  } catch {}
}

export default function ArchivedStudentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [archivedData, setArchivedData] = useState<
    educationStudentsEntryData[]
  >([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<educationStudentsEntryData | null>(null);

  // init
  useEffect(() => {
    setArchivedData(loadArchive());
  }, []);

  // Search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredData = useMemo(() => {
    return archivedData.filter((item) => {
      const lower = searchTerm.toLowerCase();
      return (
        searchTerm === "" ||
        item.studentName.toLowerCase().includes(lower) ||
        item.schoolName.toLowerCase().includes(lower) ||
        item.class.toLowerCase().includes(lower) ||
        item.studentLocation.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower)
      );
    });
  }, [archivedData, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const handleViewDetails = (entry: educationStudentsEntryData) => {
    setSelectedEntry(entry);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleDeleteClick = (entry: educationStudentsEntryData) => {
    setSelectedEntry(entry);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedEntry) return;
    setArchivedData((prev) => {
      const next = prev.filter((e) => e.id !== selectedEntry.id);
      saveArchive(next);
      return next;
    });
    setIsDeleteModalOpen(false);
    setSelectedEntry(null);
  };

  const handleUnarchive = (entry: educationStudentsEntryData) => {
    // remove from archive
    const nextArchive = archivedData.filter((e) => e.id !== entry.id);
    saveArchive(nextArchive);
    setArchivedData(nextArchive);
    // add to active
    const active = loadActive();
    saveActive([...active, entry]);
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/socio-economic/education/students">
                <Button variant="outline" className="gap-2">
                  <ChevronLeft size={16} /> Back to Students
                </Button>
              </Link>
              <h2 className="text-xl font-semibold text-gray-900">
                Archived Students
              </h2>
            </div>
          </div>

          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {searchTerm.trim() !== "" && filteredData.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-700 mb-6">
              <span className="font-medium">"{searchTerm}"</span> not found
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Student Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        School
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Class
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {item.studentName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.schoolName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.class}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.studentLocation}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(item)}
                              className="flex items-center gap-1 text-[#54D12B] hover:text-[#43b71f] p-0 h-auto"
                            >
                              <ExternalLink size={14} /> View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnarchive(item)}
                              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 p-0 h-auto"
                              title="Unarchive"
                            >
                              <ArchiveX size={14} /> Unarchive
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(item)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 p-0 h-auto"
                              title="Delete"
                            >
                              <Trash2 size={14} /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(n) => {
              setItemsPerPage(n);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        data={selectedEntry}
        onEdit={() => {}}
        onDelete={() => {}}
        socioEconomicType="educationStudents"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        socioEconomicType="educationStudents"
        itemName={selectedEntry?.studentName}
      />
    </div>
  );
}
