"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConservationTabs from "../components/ConservationTabs";
import SearchAndFilters from "../components/SearchAndFilters";
import Pagination from "../components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreateEntryModal,
  UpdateEntryModal,
  DetailsModal,
  DeleteConfirmationModal,
  ConservationData,
  ConservationType,
} from "../components";
import { BambooEntryData } from "@/lib/conservation/conservation";

const initialBambooData: BambooEntryData[] = [
  {
    id: "1",
    distanceCovered: 500,
    location: "Nyange",
    dateDonated: new Date("2024-03-15"),
    description: "Bamboo planting along riverbank for erosion control",
  },
  {
    id: "2",
    distanceCovered: 300,
    location: "Kinigi",
    dateDonated: new Date("2024-02-20"),
    description: "Bamboo fence installation for property demarcation",
  },
];

export default function BambooPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bambooData, setBambooData] =
    useState<BambooEntryData[]>(initialBambooData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<BambooEntryData | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter data based on search
  const filteredData = useMemo(() => {
    return bambooData.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [bambooData, searchTerm]);

  const handleCreateEntry = (data: ConservationData) => {
    const newEntry: BambooEntryData = {
      ...(data as Omit<BambooEntryData, "id">),
      id: Date.now().toString(),
    };
    setBambooData((prev) => [...prev, newEntry]);
    setIsCreateModalOpen(false);
  };

  const handleViewDetails = (entry: BambooEntryData) => {
    router.push(`/dashboard/conservation/bamboo?id=${entry.id}`);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedEntry(null);
    router.push(`/dashboard/conservation/bamboo`);
  };

  const handleEdit = () => {
    setIsDetailsModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEntry = (data: ConservationData) => {
    if (selectedEntry) {
      const updatedEntry: BambooEntryData = {
        ...(data as Omit<BambooEntryData, "id">),
        id: selectedEntry.id,
      };
      setBambooData((prev) =>
        prev.map((item) => (item.id === selectedEntry.id ? updatedEntry : item))
      );
      setIsUpdateModalOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      setBambooData((prev) =>
        prev.filter((entry) => entry.id !== selectedEntry.id)
      );
      setSelectedEntry(null);
    }
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    router.push(`/dashboard/conservation/bamboo`);
  };

  const handleDeleteClick = () => {
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Open details from URL id
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const entry = bambooData.find((item) => item.id === id);
      if (entry) {
        setSelectedEntry(entry);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, bambooData]);

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        <ConservationTabs />

        <div className="p-8">
          {/* Add New Entry Button */}
          <div className="mb-6">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#54D12B] text-white hover:bg-[#43b71f]"
            >
              <Plus size={20} className="mr-2" />
              Add New Bamboo Entry
            </Button>
          </div>

          {/* Search */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Bamboo Table */}
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
                        Distance Covered (m)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Date Donated
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.distanceCovered.toLocaleString()}m
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.dateDonated.toLocaleDateString()}
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
                              View More
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-[#54D12B] hover:text-[#43b71f] p-0 h-auto"
                            >
                              <Download size={14} />
                              Download
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

          {/* Pagination */}
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
      <CreateEntryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEntry}
        conservationType="bamboo"
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        data={selectedEntry}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        conservationType="bamboo"
      />

      <UpdateEntryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateEntry}
        initialData={selectedEntry}
        conservationType="bamboo"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        conservationType="bamboo"
      />
    </div>
  );
}
