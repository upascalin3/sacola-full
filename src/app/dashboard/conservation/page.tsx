"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import ConservationTabs from "./components/ConservationTabs";
import CreateEntryModal from "./components/CreateEntryModal";
import DetailsModal from "./components/DetailsModal";
import UpdateEntryModal from "./components/UpdateEntryModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import SearchAndFilters from "./components/SearchAndFilters";
import Pagination from "./components/Pagination";

interface TreeEntryData {
  id: string;
  treeType: string;
  location: string;
  numberOfTrees: number;
  datePlanted: string;
  targetBeneficiaries: number;
  currentBeneficiaries: number;
  description: string;
}

const initialTreePlantingData: TreeEntryData[] = [
  {
    id: "1",
    treeType: "Avocados",
    location: "Nyange",
    numberOfTrees: 1000,
    datePlanted: "2024-03-15",
    targetBeneficiaries: 1000,
    currentBeneficiaries: 834,
    description: "Today we planted trees and all the trees that we gave were planted so it was successful"
  },
  {
    id: "2",
    treeType: "Passion Fruits",
    location: "Kinigi",
    numberOfTrees: 300,
    datePlanted: "2024-02-20",
    targetBeneficiaries: 300,
    currentBeneficiaries: 250,
    description: "Passion fruit trees planted in Kinigi area"
  },
  {
    id: "3",
    treeType: "Ornament Trees",
    location: "Kinigi",
    numberOfTrees: 1000,
    datePlanted: "2024-01-10",
    targetBeneficiaries: 500,
    currentBeneficiaries: 450,
    description: "Ornamental trees for beautification"
  },
  {
    id: "4",
    treeType: "Seedlings",
    location: "Nyange",
    numberOfTrees: 200,
    datePlanted: "2024-04-05",
    targetBeneficiaries: 200,
    currentBeneficiaries: 180,
    description: "Various seedling types planted"
  },
  {
    id: "5",
    treeType: "Forest Trees",
    location: "Kinigi",
    numberOfTrees: 400,
    datePlanted: "2024-03-01",
    targetBeneficiaries: 400,
    currentBeneficiaries: 380,
    description: "Forest conservation trees"
  },
  {
    id: "6",
    treeType: "Mango Trees",
    location: "Nyange",
    numberOfTrees: 150,
    datePlanted: "2024-05-10",
    targetBeneficiaries: 150,
    currentBeneficiaries: 120,
    description: "Mango trees for fruit production"
  },
  {
    id: "7",
    treeType: "Coffee Trees",
    location: "Kinigi",
    numberOfTrees: 800,
    datePlanted: "2024-04-20",
    targetBeneficiaries: 600,
    currentBeneficiaries: 550,
    description: "Coffee trees for economic development"
  },
  {
    id: "8",
    treeType: "Tea Trees",
    location: "Nyange",
    numberOfTrees: 600,
    datePlanted: "2024-03-25",
    targetBeneficiaries: 400,
    currentBeneficiaries: 380,
    description: "Tea trees for sustainable agriculture"
  }
];

export default function ConservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [treeData, setTreeData] = useState<TreeEntryData[]>(initialTreePlantingData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TreeEntryData | null>(null);

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Check for ID parameter in URL and open details modal
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const entry = treeData.find(item => item.id === id);
      if (entry) {
        setSelectedEntry(entry);
        setIsDetailsModalOpen(true);
      }
    }
  }, [searchParams, treeData]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return treeData.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.treeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleCreateEntry = (data: Omit<TreeEntryData, 'id'>) => {
    const newEntry: TreeEntryData = {
      ...data,
      id: Date.now().toString()
    };
    setTreeData(prev => [...prev, newEntry]);
    setCurrentPage(1); // Reset to first page when adding new entry
  };

  const handleViewDetails = (entry: TreeEntryData) => {
    router.push(`/dashboard/conservation?id=${entry.id}`);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedEntry(null);
    router.push('/dashboard/conservation');
  };

  const handleEdit = () => {
    setIsDetailsModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEntry = (data: Omit<TreeEntryData, 'id'>) => {
    if (selectedEntry) {
      setTreeData(prev => 
        prev.map(entry => 
          entry.id === selectedEntry.id 
            ? { ...data, id: selectedEntry.id }
            : entry
        )
      );
      setSelectedEntry({ ...data, id: selectedEntry.id });
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      setTreeData(prev => prev.filter(entry => entry.id !== selectedEntry.id));
      setSelectedEntry(null);
    }
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    router.push('/dashboard/conservation');
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
        <ConservationTabs />

        {/* Main Content */}
        <div className="p-8">
          {/* Add New Entry Button */}
          <div className="mb-6">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#54D12B] text-white hover:bg-[#43b71f]"
            >
              <Plus size={20} className="mr-2" />
              Add New Tree Entry
            </Button>
          </div>

          {/* Search */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Tree Planting Table */}
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
                      Number of Trees
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
                        {item.treeType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.numberOfTrees.toLocaleString()}
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
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        data={selectedEntry}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <UpdateEntryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateEntry}
        initialData={selectedEntry}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedEntry?.treeType}
      />
    </div>
  );
}
