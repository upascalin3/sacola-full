"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, ExternalLink } from "lucide-react";
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
import { buffaloWallEntryData } from "@/lib/conservation/conservation";

const initialBuffaloWallData: buffaloWallEntryData[] = [
  {
    id: "1",
    dateRepaired: new Date("2024-03-15"),
    cost: 50000,
  },
  {
    id: "2",
    dateRepaired: new Date("2024-02-20"),
    cost: 75000,
  },
];

export default function BuffaloWallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buffaloWallData, setBuffaloWallData] = useState<
    buffaloWallEntryData[]
  >(initialBuffaloWallData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<buffaloWallEntryData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter data based on search
  const filteredData = useMemo(() => {
    return buffaloWallData.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.cost.toString().includes(searchTerm) ||
        item.dateRepaired.toLocaleDateString().includes(searchTerm);

      return matchesSearch;
    });
  }, [buffaloWallData, searchTerm]);

  const handleCreateEntry = (data: ConservationData) => {
    const newEntry: buffaloWallEntryData = {
      ...(data as Omit<buffaloWallEntryData, "id">),
      id: Date.now().toString(),
    };
    setBuffaloWallData((prev) => [...prev, newEntry]);
    setIsCreateModalOpen(false);
  };

  const handleViewDetails = (entry: buffaloWallEntryData) => {
    router.push(`/dashboard/conservation/buffalo-wall?id=${entry.id}`);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedEntry(null);
    router.push(`/dashboard/conservation/buffalo-wall`);
  };

  const handleEdit = () => {
    setIsDetailsModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEntry = (data: ConservationData) => {
    if (selectedEntry) {
      const updatedEntry: buffaloWallEntryData = {
        ...(data as Omit<buffaloWallEntryData, "id">),
        id: selectedEntry.id,
      };
      setBuffaloWallData((prev) =>
        prev.map((item) => (item.id === selectedEntry.id ? updatedEntry : item))
      );
      setIsUpdateModalOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      setBuffaloWallData((prev) =>
        prev.filter((entry) => entry.id !== selectedEntry.id)
      );
      setSelectedEntry(null);
    }
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    router.push(`/dashboard/conservation/buffalo-wall`);
  };

  const handleDeleteClick = () => {
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  // Pagination
  const filteredSortedData = filteredData; // keep as-is, but placeholder if we need sorting
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSortedData.slice(startIndex, endIndex);
  }, [filteredSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSortedData.length / itemsPerPage)
  );

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
      const entry = buffaloWallData.find((item) => item.id === id);
      if (entry) {
        setSelectedEntry(entry);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, buffaloWallData]);

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
              Add New Buffalo Wall Entry
            </Button>
          </div>

          {/* Search */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Buffalo Wall Table */}
          {searchTerm.trim() !== "" && filteredSortedData.length === 0 ? (
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
                        Date Repaired
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Cost (RWF)
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
                          {item.dateRepaired.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.cost.toLocaleString()} RWF
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
            totalItems={filteredSortedData.length}
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
        conservationType="buffaloWall"
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        data={selectedEntry}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        conservationType="buffaloWall"
      />

      <UpdateEntryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateEntry}
        initialData={selectedEntry}
        conservationType="buffaloWall"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        conservationType="buffaloWall"
      />
    </div>
  );
}
