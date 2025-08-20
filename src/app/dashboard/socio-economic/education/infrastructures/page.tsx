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
import { educationInfrastructuresEntryData } from "@/lib/socio-economic/socio-economic";
import SearchAndFilters from "../../components/SearchAndFilters";
import Pagination from "../../components/Pagination";

const Data: educationInfrastructuresEntryData[] = [
  {
    id: "1",
    schoolName: "Nyange Primary School",
    location: "Nyange Sector",
    infrastructureType: "Primary",
    dateDonated: new Date("2023-06-15"),
    description:
      "Complete primary school building with 8 classrooms, office, and library",
  },
  {
    id: "2",
    schoolName: "Kinigi Secondary School",
    location: "Kinigi Sector",
    infrastructureType: "Ordinary Level",
    dateDonated: new Date("2023-09-20"),
    description: "Secondary school building with science lab and computer room",
  },
  {
    id: "3",
    schoolName: "Ruhondo Early Childhood Center",
    location: "Ruhondo Sector",
    infrastructureType: "ECD",
    dateDonated: new Date("2024-01-10"),
    description:
      "Early childhood development center with play area and learning materials",
  },
  {
    id: "4",
    schoolName: "Musanze Vocational Training Center",
    location: "Musanze District",
    infrastructureType: "Vocational Training",
    dateDonated: new Date("2023-12-05"),
    description:
      "Vocational training facility for carpentry, welding, and tailoring",
  },
];

export default function EducationInfrastructuresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [infrastructuresData, setInfrastructuresData] =
    useState<educationInfrastructuresEntryData[]>(Data);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<educationInfrastructuresEntryData | null>(null);

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Check for ID parameter in URL and open details modal
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const entry = infrastructuresData.find((item) => item.id === id);
      if (entry) {
        setSelectedEntry(entry);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, infrastructuresData]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return infrastructuresData.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.infrastructureType
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [infrastructuresData, searchTerm]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const handleCreateEntry = (data: SocioEconomicData) => {
    const newEntry: educationInfrastructuresEntryData = {
      ...(data as Omit<educationInfrastructuresEntryData, "id">),
      id: Date.now().toString(),
    };
    setInfrastructuresData((prev) => [...prev, newEntry]);
    setIsCreateModalOpen(false);
  };

  const handleViewDetails = (entry: educationInfrastructuresEntryData) => {
    router.push(
      `/dashboard/socio-economic/education/infrastructures?id=${entry.id}`
    );
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedEntry(null);
    router.push("/dashboard/socio-economic/education/infrastructures");
  };

  const handleEdit = () => {
    setIsDetailsModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEntry = (data: SocioEconomicData) => {
    if (selectedEntry) {
      const updatedEntry: educationInfrastructuresEntryData = {
        ...(data as Omit<educationInfrastructuresEntryData, "id">),
        id: selectedEntry.id,
      };
      setInfrastructuresData((prev) =>
        prev.map((item) => (item.id === selectedEntry.id ? updatedEntry : item))
      );
      setIsUpdateModalOpen(false);
      setSelectedEntry(null);
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      setInfrastructuresData((prev) =>
        prev.filter((entry) => entry.id !== selectedEntry.id)
      );
      setSelectedEntry(null);
    }
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    router.push("/dashboard/socio-economic/education/infrastructures");
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

          {/* Infrastructures Table */}
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
                        School Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Type
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
                          {item.schoolName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.infrastructureType}
                          </span>
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
        socioEconomicType="educationInfrastructures"
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        data={selectedEntry}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        socioEconomicType="educationInfrastructures"
      />

      <UpdateEntryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateEntry}
        initialData={selectedEntry}
        socioEconomicType="educationInfrastructures"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        socioEconomicType="educationInfrastructures"
        itemName={selectedEntry?.schoolName}
      />
    </div>
  );
}
