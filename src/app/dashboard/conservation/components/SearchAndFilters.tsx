"use client";

import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    location?: string;
    startDate?: string;
    endDate?: string;
    district?: string;
    status?: string;
    [key: string]: string | undefined;
  };
  onFiltersChange: (filters: any) => void;
  availableFilters?: string[];
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  availableFilters = ['location', 'startDate', 'endDate']
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  // Disable filter controls entirely for conservation pages
  const showFilterControls = false;

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    const clearedFilters: any = {};
    availableFilters.forEach(filter => {
      clearedFilters[filter] = undefined;
    });
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = availableFilters.some(filter => filters[filter]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col gap-4">
        {/* Search and Filter Toggle */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
              />
            </div>
          </div>
          {showFilterControls && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 ${showFilters ? 'bg-[#54D12B] text-white border-[#54D12B]' : 'border-gray-300'}`}
              >
                <Filter size={16} />
                Filters
                {hasActiveFilters && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2 border-gray-300 text-gray-600 hover:text-gray-800"
                >
                  <X size={16} />
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilterControls && showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFilters.includes('location') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    placeholder="Filter by location"
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                  />
                </div>
              )}

              {availableFilters.includes('district') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <Input
                    placeholder="Filter by district"
                    value={filters.district || ''}
                    onChange={(e) => handleFilterChange('district', e.target.value)}
                    className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                  />
                </div>
              )}

              {availableFilters.includes('status') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-[#F0F8F0] border border-gray-300 rounded-md focus:ring-[#54D12B] focus:border-[#54D12B]"
                  >
                    <option value="">All Status</option>
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              {availableFilters.includes('startDate') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                  />
                </div>
              )}

              {availableFilters.includes('endDate') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
