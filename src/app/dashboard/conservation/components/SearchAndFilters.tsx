"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
}: SearchAndFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search by tree type, location, or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
