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
import { EUfundedEntryData } from "@/lib/conservation/conservation";

const initialEUFundedData: EUfundedEntryData[] = [
  {
    id: "1",
    district: "Musanze",
    location: "Nyange",
    treesPlanted: 2000,
    datePlanted: new Date("2024-03-15"),
    targetBeneficiaries: 800,
    currentBeneficiaries: 750,
    description: "EU-funded reforestation project in Nyange area",
  },
  {
    id: "2",
    district: "Musanze",
    location: "Kinigi",
    treesPlanted: 1500,
    datePlanted: new Date("2024-02-20"),
    targetBeneficiaries: 600,
    currentBeneficiaries: 580,
    description: "European Union conservation initiative in Kinigi",
  },
];

export default function EUProPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [euFundedData, setEUFundedData] =
    useState<EUfundedEntryData[]>(initialEUFundedData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<EUfundedEntryData | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter data based on search
  const filteredData = useMemo(() => {
    return euFundedData.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [euFundedData, searchTerm]);

  const handleCreateEntry = (data: ConservationData) => {
    const newEntry: EUfundedEntryData = {
      ...(data as Omit<EUfundedEntryData, "id">),
      id: Date.now().toString(),
    };
    setEUFundedData((prev) => [...prev, newEntry]);
    setIsCreateModalOpen(false);
  };

  const handleViewDetails = (entry: EUfundedEntryData) => {
    router.push(`/dashboard/conservation/eu-pro?id=${entry.id}`);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedEntry(null);
    router.push(`/dashboard/conservation/eu-pro`);
  };

  const handleEdit = () => {
    setIsDetailsModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEntry = (data: ConservationData) => {
    if (selectedEntry) {
      const updatedEntry: EUfundedEntryData = {
        ...(data as Omit<EUfundedEntryData, "id">),
        id: selectedEntry.id,
      };
      setEUFundedData((prev) =>
        prev.map((item) => (item.id === selectedEntry.id ? updatedEntry : item))
      );
      setIsUpdateModalOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      setEUFundedData((prev) =>
        prev.filter((entry) => entry.id !== selectedEntry.id)
      );
      setSelectedEntry(null);
    }
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    router.push(`/dashboard/conservation/eu-pro`);
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
      const entry = euFundedData.find((item) => item.id === id);
      if (entry) {
        setSelectedEntry(entry);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, euFundedData]);

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
              Add New EU Project Entry
            </Button>
          </div>

          {/* Search */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* EU Projects Table */}
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
                        District
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Trees Planted
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Beneficiaries
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
                          {item.district}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.treesPlanted.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.currentBeneficiaries} /{" "}
                          {item.targetBeneficiaries}
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
        conservationType="euFunded"
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        data={selectedEntry}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        conservationType="euFunded"
      />

      <UpdateEntryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateEntry}
        initialData={selectedEntry}
        conservationType="euFunded"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        conservationType="euFunded"
      />
    </div>
  );
}
