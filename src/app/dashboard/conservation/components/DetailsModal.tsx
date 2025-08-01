"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TreeEntryDetails {
  treeType: string;
  location: string;
  numberOfTrees: number;
  datePlanted: string;
  targetBeneficiaries: number;
  currentBeneficiaries: number;
  description: string;
}

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TreeEntryDetails | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DetailsModal({
  isOpen,
  onClose,
  data,
  onEdit,
  onDelete,
}: DetailsModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#54D12B]">{data.treeType}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tree Type
              </label>
              <p className="text-gray-900">{data.treeType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <p className="text-gray-900">{data.location}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Trees Planted
              </label>
              <p className="text-gray-900">
                {data.numberOfTrees.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Planted
              </label>
              <p className="text-gray-900">{data.datePlanted}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Beneficiaries
              </label>
              <p className="text-gray-900">
                {data.targetBeneficiaries.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Beneficiaries
              </label>
              <p className="text-gray-900">
                {data.currentBeneficiaries.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <p className="text-gray-900">{data.description}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onEdit}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Edit
          </Button>
          <Button
            onClick={onDelete}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
