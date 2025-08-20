"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, ExternalLink } from "lucide-react";
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
import { educationMaterialsEntryData } from "@/lib/socio-economic/socio-economic";
import SearchAndFilters from "../../components/SearchAndFilters";
import Pagination from "../../components/Pagination";

const Data: educationMaterialsEntryData[] = [
  {
    id: "1",
    materialType: "Textbooks",
    location: "Nyange Primary School",
    distributedMaterials: 150,
    dateDonated: new Date("2024-01-15"),
    targetBeneficiaries: 200,
    currentBeneficiaries: 180,
    description: "Mathematics and Science textbooks for primary students",
  },
  {
    id: "2",
    materialType: "Exercise Books",
    location: "Kinigi Secondary School",
    distributedMaterials: 300,
    dateDonated: new Date("2024-02-20"),
    targetBeneficiaries: 250,
    currentBeneficiaries: 250,
    description: "Exercise books for all subjects and grade levels",
  },
  {
    id: "3",
    materialType: "Pens and Pencils",
    location: "Ruhondo Community School",
    distributedMaterials: 500,
    dateDonated: new Date("2024-03-10"),
    targetBeneficiaries: 400,
    currentBeneficiaries: 380,
    description: "Writing materials for students in need",
  },
];

export default function EducationMaterialsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [materialsData, setMaterialsData] =
    useState<educationMaterialsEntryData[]>(Data);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<educationMaterialsEntryData | null>(null);

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Check for ID parameter in URL and open details modal
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const entry = materialsData.find((item) => item.id === id);
      if (entry) {
        setSelectedEntry(entry);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, materialsData]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return materialsData.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.materialType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [materialsData, searchTerm]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const handleCreateEntry = (data: SocioEconomicData) => {
    const newEntry: educationMaterialsEntryData = {
      ...(data as Omit<educationMaterialsEntryData, "id">),
      id: Date.now().toString(),
    };
    setMaterialsData((prev) => [...prev, newEntry]);
    setIsCreateModalOpen(false);
  };

  const handleViewDetails = (entry: educationMaterialsEntryData) => {
    router.push(`/dashboard/socio-economic/education/materials?id=${entry.id}`);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedEntry(null);
    router.push("/dashboard/socio-economic/education/materials");
  };

  const handleEdit = () => {
    setIsDetailsModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEntry = (data: SocioEconomicData) => {
    if (selectedEntry) {
      const updatedEntry: educationMaterialsEntryData = {
        ...(data as Omit<educationMaterialsEntryData, "id">),
        id: selectedEntry.id,
      };
      setMaterialsData((prev) =>
        prev.map((item) => (item.id === selectedEntry.id ? updatedEntry : item))
      );
      setIsUpdateModalOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      setMaterialsData((prev) =>
        prev.filter((entry) => entry.id !== selectedEntry.id)
      );
      setSelectedEntry(null);
    }
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    router.push("/dashboard/socio-economic/education/materials");
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
              Add New Entry
            </Button>
          </div>

          {/* Search */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Materials Table */}
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
                        Material Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Distributed
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
                          {item.materialType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.distributedMaterials}
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
        socioEconomicType="educationMaterials"
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        data={selectedEntry}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        socioEconomicType="educationMaterials"
      />

      <UpdateEntryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateEntry}
        initialData={selectedEntry}
        socioEconomicType="educationMaterials"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        socioEconomicType="educationMaterials"
        itemName={selectedEntry?.materialType}
      />
    </div>
  );
}
