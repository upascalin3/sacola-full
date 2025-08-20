"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { SocioEconomicModals } from "./SocioEconomicModals";
import { useSocioEconomicModals } from "./useSocioEconomicModals";
import {
  SocioEconomicData,
  SocioEconomicType,
  SOCIO_ECONOMIC_CONFIGS,
} from "@/lib/socio-economic/types";
import SearchAndFilters from "./SearchAndFilters";
import Pagination from "./Pagination";
import { ExternalLink, Download } from "lucide-react";

interface SocioEconomicPageExampleProps {
  socioEconomicType: SocioEconomicType;
  entries?: SocioEconomicData[];
  onCreateEntry?: (data: SocioEconomicData) => Promise<void>;
  onUpdateEntry?: (data: SocioEconomicData) => Promise<void>;
  onDeleteEntry?: (data: SocioEconomicData) => Promise<void>;
}

export function SocioEconomicPageExample({
  socioEconomicType,
  entries = [],
  onCreateEntry,
  onUpdateEntry,
  onDeleteEntry,
}: SocioEconomicPageExampleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    modalState,
    openCreateModal,
    openUpdateModal,
    openDeleteModal,
    openDetailsModal,
    closeModal,
  } = useSocioEconomicModals();

  const handleCreateEntry = async (data: SocioEconomicData) => {
    if (onCreateEntry) {
      await onCreateEntry(data);
    }
  };

  const handleUpdateEntry = async (data: SocioEconomicData) => {
    if (onUpdateEntry) {
      await onUpdateEntry(data);
    }
  };

  const handleDeleteEntry = async () => {
    if (onDeleteEntry && modalState.data) {
      await onDeleteEntry(modalState.data);
    }
  };

  const config = SOCIO_ECONOMIC_CONFIGS[socioEconomicType];
  const visibleFields = useMemo(
    () => config.fields.filter((f) => f.type !== "textarea").slice(0, 3),
    [config.fields]
  );

  const filteredEntries = useMemo(() => {
    if (!searchTerm.trim()) return entries;
    const lower = searchTerm.toLowerCase();
    return entries.filter((entry) => {
      const values = Object.values(entry as unknown as Record<string, unknown>);
      return values.some((v) => {
        if (v == null) return false;
        if (v instanceof Date)
          return v.toLocaleDateString().toLowerCase().includes(lower);
        return String(v).toLowerCase().includes(lower);
      });
    });
  }, [entries, searchTerm]);

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEntries.slice(startIndex, endIndex);
  }, [filteredEntries, currentPage, itemsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEntries.length / itemsPerPage)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {socioEconomicType}
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your {socioEconomicType} entries
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-[#54D12B] hover:bg-[#54D12B]/90"
        >
          Create New Entry
        </Button>
      </div>

      {/* Search */}
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {searchTerm.trim() !== "" && filteredEntries.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="text-gray-700">
                <span className="font-medium">"{searchTerm}"</span> not found
              </div>
            </div>
          </CardContent>
        </Card>
      ) : filteredEntries.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {visibleFields.map((field) => (
                    <th
                      key={field.key}
                      className="px-6 py-4 text-left text-sm font-medium text-gray-900"
                    >
                      {field.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedEntries.map((entry, index) => (
                  <tr
                    key={(entry as any).id ?? index}
                    className="hover:bg-gray-50"
                  >
                    {visibleFields.map((field) => {
                      const raw = (entry as any)[field.key];
                      let display: string | number = raw as any;
                      if (raw instanceof Date)
                        display = raw.toLocaleDateString();
                      return (
                        <td
                          key={field.key}
                          className="px-6 py-4 text-sm text-gray-900"
                        >
                          {String(display)}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsModal(entry)}
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
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  No entries yet
                </h3>
                <p className="text-gray-500 mt-1">
                  Get started by creating your first entry.
                </p>
              </div>
              <Button
                onClick={openCreateModal}
                className="bg-[#54D12B] hover:bg-[#54D12B]/90"
              >
                Create First Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredEntries.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredEntries.length}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(n) => {
            setItemsPerPage(n);
            setCurrentPage(1);
          }}
        />
      )}

      <SocioEconomicModals
        isOpen={modalState.isOpen}
        onClose={closeModal}
        action={modalState.action}
        socioEconomicType={socioEconomicType}
        data={modalState.data}
        onSubmit={
          modalState.action === "create" ? handleCreateEntry : handleUpdateEntry
        }
        onDelete={handleDeleteEntry}
      />
    </div>
  );
}
