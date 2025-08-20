"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  ExternalLink,
  Archive as ArchiveIcon,
  Users,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { SocioEconomicTabs } from "../../components";
import {
  CreateEntryModal,
  UpdateEntryModal,
  DetailsModal,
  DeleteConfirmationModal,
  SocioEconomicData,
  SocioEconomicType,
} from "../../components";
import { educationStudentsEntryData } from "@/lib/socio-economic/socio-economic";
import SearchAndFilters from "../../components/SearchAndFilters";
import Pagination from "../../components/Pagination";

const ACTIVE_KEY = "educationStudentsActive";
const ARCHIVE_KEY = "educationStudentsArchive";

const DefaultData: educationStudentsEntryData[] = [
  {
    id: "1",
    studentName: "Jean Pierre Uwimana",
    studentLocation: "Nyange Sector",
    schoolName: "Nyange Primary School",
    schoolLocation: "Nyange",
    class: "Primary 6",
    fundingYears: 3,
    description:
      "Orphan student receiving full educational support including school fees, uniforms, and materials",
  },
  {
    id: "2",
    studentName: "Marie Claire Mukamana",
    studentLocation: "Kinigi Sector",
    schoolName: "Kinigi Secondary School",
    schoolLocation: "Kinigi",
    class: "Senior 3",
    fundingYears: 2,
    description:
      "Student from vulnerable family receiving partial support for school fees and materials",
  },
  {
    id: "3",
    studentName: "Emmanuel Ndayisaba",
    studentLocation: "Ruhondo Sector",
    schoolName: "Ruhondo Community School",
    schoolLocation: "Ruhondo",
    class: "Primary 4",
    fundingYears: 1,
    description:
      "New student receiving educational materials and uniform support",
  },
  {
    id: "4",
    studentName: "Ange Uwineza",
    studentLocation: "Musanze District",
    schoolName: "Musanze Vocational Training Center",
    schoolLocation: "Musanze",
    class: "Carpentry Level 2",
    fundingYears: 2,
    description:
      "Vocational training student receiving full support for course fees and tools",
  },
  {
    id: "5",
    studentName: "Patrick Niyonshuti",
    studentLocation: "Nyange Sector",
    schoolName: "Nyange Primary School",
    schoolLocation: "Nyange",
    class: "Primary 5",
    fundingYears: 4,
    description: "Long-term supported student, excellent academic performance",
  },
];

function loadActive(): educationStudentsEntryData[] {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return DefaultData;
    const parsed = JSON.parse(raw) as educationStudentsEntryData[];
    return parsed;
  } catch {
    return DefaultData;
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

export default function EducationStudentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [studentsData, setStudentsData] =
    useState<educationStudentsEntryData[]>(DefaultData);
  const [archivedData, setArchivedData] = useState<
    educationStudentsEntryData[]
  >([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<educationStudentsEntryData | null>(null);

  useEffect(() => {
    const initial = loadActive();
    const archived = loadArchive();
    setStudentsData(initial);
    setArchivedData(archived);
    if (!localStorage.getItem(ACTIVE_KEY)) {
      saveActive(initial);
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const entry = studentsData.find((item) => item.id === id);
      if (entry) {
        setSelectedEntry(entry);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, studentsData]);

  const currentData = activeTab === "active" ? studentsData : archivedData;

  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [currentData, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const handleCreateEntry = (data: SocioEconomicData) => {
    const newEntry: educationStudentsEntryData = {
      ...(data as Omit<educationStudentsEntryData, "id">),
      id: Date.now().toString(),
    };
    setStudentsData((prev) => {
      const next = [...prev, newEntry];
      saveActive(next);
      return next;
    });
    setIsCreateModalOpen(false);
  };

  const handleViewDetails = (entry: educationStudentsEntryData) => {
    if (activeTab === "active") {
      router.push(
        `/dashboard/socio-economic/education/students?id=${entry.id}`
      );
    } else {
      setSelectedEntry(entry);
      setIsDetailsModalOpen(true);
    }
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedEntry(null);
    if (activeTab === "active") {
      router.push("/dashboard/socio-economic/education/students");
    }
  };

  const handleEdit = () => {
    setIsDetailsModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEntry = (data: SocioEconomicData) => {
    if (selectedEntry) {
      const updatedEntry: educationStudentsEntryData = {
        ...(data as Omit<educationStudentsEntryData, "id">),
        id: selectedEntry.id,
      };
      setStudentsData((prev) => {
        const next = prev.map((item) =>
          item.id === selectedEntry.id ? updatedEntry : item
        );
        saveActive(next);
        return next;
      });
      setIsUpdateModalOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      if (activeTab === "active") {
        setStudentsData((prev) => {
          const next = prev.filter((entry) => entry.id !== selectedEntry.id);
          saveActive(next);
          return next;
        });
      } else {
        setArchivedData((prev) => {
          const next = prev.filter((entry) => entry.id !== selectedEntry.id);
          saveArchive(next);
          return next;
        });
      }
      setSelectedEntry(null);
    }
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    if (activeTab === "active") {
      router.push("/dashboard/socio-economic/education/students");
    }
  };

  const handleDeleteClick = () => {
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleArchive = (entry: educationStudentsEntryData) => {
    const archive = loadArchive();
    const nextArchive = [...archive, entry];
    saveArchive(nextArchive);
    setArchivedData(nextArchive);
    setStudentsData((prev) => {
      const next = prev.filter((e) => e.id !== entry.id);
      saveActive(next);
      return next;
    });
  };

  const handleUnarchive = (entry: educationStudentsEntryData) => {
    const nextArchive = archivedData.filter((e) => e.id !== entry.id);
    saveArchive(nextArchive);
    setArchivedData(nextArchive);
    const active = loadActive();
    saveActive([...active, entry]);
    setStudentsData([...active, entry]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: "active" | "archived") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <SocioEconomicTabs />

        <div className="p-8">
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => handleTabChange("active")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "active"
                      ? "border-[#54D12B] text-[#54D12B]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    Active Students
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange("archived")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "archived"
                      ? "border-[#54D12B] text-[#54D12B]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Archive size={16} />
                    Archived Students
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Header Actions */}
          <div className="mb-6 flex items-center gap-3">
            {activeTab === "active" && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#54D12B] text-white hover:bg-[#43b71f]"
              >
                <Plus size={20} className="mr-2" />
                Add New Entry
              </Button>
            )}
            <div className="text-sm text-gray-600">
              {activeTab === "active" ? (
                <span>{studentsData.length} active students</span>
              ) : (
                <span>{archivedData.length} archived students</span>
              )}
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
                        Funding Years
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
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.fundingYears} year
                            {item.fundingYears > 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(item)}
                              className="flex items-center gap-1 text-[#54D12B] hover:text-[#43b71f] p-0 h-auto"
                            >
                              <ExternalLink size={14} />
                              View
                            </Button>
                            {activeTab === "active" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleArchive(item)}
                                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 p-0 h-auto"
                                title="Archive"
                              >
                                <ArchiveIcon size={14} />
                                Archive
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnarchive(item)}
                                  className="flex items-center gap-1 text-amber-600 hover:text-amber-700 p-0 h-auto"
                                  title="Unarchive"
                                >
                                  <ArchiveIcon size={14} />
                                  Unarchive
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedEntry(item);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="flex items-center gap-1 text-red-600 hover:text-red-700 p-0 h-auto"
                                  title="Delete"
                                >
                                  <ArchiveIcon size={14} />
                                  Delete
                                </Button>
                              </>
                            )}
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
            onPageChange={handlePageChange}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>

      {/* Modals */}
      {activeTab === "active" && (
        <CreateEntryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateEntry}
          socioEconomicType="educationStudents"
        />
      )}

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        data={selectedEntry}
        onEdit={activeTab === "active" ? handleEdit : () => {}}
        onDelete={activeTab === "active" ? handleDeleteClick : () => {}}
        socioEconomicType="educationStudents"
      />

      {activeTab === "active" && (
        <UpdateEntryModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleUpdateEntry}
          initialData={selectedEntry}
          socioEconomicType="educationStudents"
        />
      )}

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
