"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { SocioEconomicTabs } from "../components";
import {
  CreateEntryModal,
  UpdateEntryModal,
  DetailsModal,
  DeleteConfirmationModal,
  SocioEconomicData,
  SocioEconomicType,
} from "../components";
import { waterPumpsEntryData } from "@/lib/socio-economic/socio-economic";
import SearchAndFilters from "../components/SearchAndFilters";
import Pagination from "../components/Pagination";

const Data: waterPumpsEntryData[] = [  
  {
    id: "1",
    pumpName: "Pump 1",
    location: "Nyange",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Good",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "2",
    pumpName: "Pump 2",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Bad",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },  {
    id: "3",
    pumpName: "Pump 3",
    location: "Nyange",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Bad",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },  {
    id: "4",
    pumpName: "Pump 4",
    location: "Nyange",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Good",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },  {
    id: "5",
    pumpName: "Pump 5",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Good",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },  {
    id: "6",
    pumpName: "Pump 6",
    location: "Nyange",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Good",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
  {
    id: "7",
    pumpName: "Pump 7",
    location: "Kinigi",
    dateBuilt: new Date("2024-03-15"),
    pumpCondition: "Bad",
    description:
      "Today we planted trees and all the trees that we gave were planted so it was successful",
  },
];

export default function waterPumpsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [treeData, setTreeData] = useState<waterPumpsEntryData[]>(
    Data
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<waterPumpsEntryData | null>(
    null
  );

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Check for ID parameter in URL and open details modal
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const entry = treeData.find((item) => item.id === id);
      if (entry) {
        setSelectedEntry(entry);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, treeData]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return treeData.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.pumpName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [treeData, searchTerm]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const handleCreateEntry = (data: SocioEconomicData) => {
    const newEntry: waterPumpsEntryData = {
      ...(data as Omit<waterPumpsEntryData, "id">),
      id: Date.now().toString(),
    };
    setTreeData((prev) => [...prev, newEntry]);
    setIsCreateModalOpen(false);
  };

  const handleViewDetails = (entry: waterPumpsEntryData) => {
    router.push(`/dashboard/socio-economic/water-pumps?id=${entry.id}`);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedEntry(null);
    router.push("/dashboard/socio-economic/water-pumps");
  };

  const handleEdit = () => {
    setIsDetailsModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEntry = (data: SocioEconomicData) => {
    if (selectedEntry) {
      const updatedEntry: waterPumpsEntryData = {
        ...(data as Omit<waterPumpsEntryData, "id">),
        id: selectedEntry.id,
      };
      setTreeData((prev) =>
        prev.map((item) => (item.id === selectedEntry.id ? updatedEntry : item))
      );
      setIsUpdateModalOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      setTreeData((prev) =>
        prev.filter((entry) => entry.id !== selectedEntry.id)
      );
      setSelectedEntry(null);
    }
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    router.push("/dashboard/socio-economic/water-pumps");
  };

  const handleDeleteClick = () => {
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <SocioEconomicTabs />

        {/* Main Content */}
        <div className="p-8">
          {/* Add New Entry Button */}
          <div className="mb-6">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#54D12B] text-white hover:bg-[#43b71f]"
            >
              <Plus size={20} className="mr-2" />
              Add New WaterPumps Entry
            </Button>
          </div>

          {/* Search */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Tree Planting Table */}
          {searchTerm.trim() !== "" && filteredData.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-700 mb-6">
              <span className="font-medium">"{searchTerm}"</span> not
              found
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Condition
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
                          {item.pumpName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.pumpCondition.toLocaleString()}
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
        socioEconomicType="waterPumps"
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        data={selectedEntry}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        socioEconomicType="waterPumps"
      />

      <UpdateEntryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateEntry}
        initialData={selectedEntry}
        socioEconomicType="waterPumps"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        socioEconomicType="waterPumps"
        itemName={selectedEntry?.pumpName}
      />
    </div>
  );
}
