"use client";

import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TreeEntryData) => void;
}

interface TreeEntryData {
  treeType: string;
  location: string;
  numberOfTrees: number;
  datePlanted: string;
  targetBeneficiaries: number;
  currentBeneficiaries: number;
  description: string;
}

export default function CreateEntryModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateEntryModalProps) {
  const [formData, setFormData] = useState<TreeEntryData>({
    treeType: "",
    location: "",
    numberOfTrees: 0,
    datePlanted: "",
    targetBeneficiaries: 0,
    currentBeneficiaries: 0,
    description: "",
  });

  const handleInputChange = (
    field: keyof TreeEntryData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      treeType: "",
      location: "",
      numberOfTrees: 0,
      datePlanted: "",
      targetBeneficiaries: 0,
      currentBeneficiaries: 0,
      description: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Entry</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="treeType">Tree Type</Label>
              <Input
                id="treeType"
                type="text"
                placeholder="Enter Tree Type"
                value={formData.treeType}
                onChange={(e) => handleInputChange("treeType", e.target.value)}
                className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfTrees">Number of Trees Planted</Label>
              <Input
                id="numberOfTrees"
                type="number"
                placeholder="Enter number of trees"
                value={formData.numberOfTrees || ""}
                onChange={(e) =>
                  handleInputChange(
                    "numberOfTrees",
                    parseInt(e.target.value) || 0
                  )
                }
                className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="datePlanted">Date Planted</Label>
              <div className="relative">
                <Input
                  id="datePlanted"
                  type="date"
                  value={formData.datePlanted}
                  onChange={(e) =>
                    handleInputChange("datePlanted", e.target.value)
                  }
                  className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                  required
                />
                <Calendar
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetBeneficiaries">Target Beneficiaries</Label>
              <Input
                id="targetBeneficiaries"
                type="number"
                placeholder="Enter number of target beneficiaries"
                value={formData.targetBeneficiaries || ""}
                onChange={(e) =>
                  handleInputChange(
                    "targetBeneficiaries",
                    parseInt(e.target.value) || 0
                  )
                }
                className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentBeneficiaries">
                Current Beneficiaries
              </Label>
              <Input
                id="currentBeneficiaries"
                type="number"
                placeholder="Current beneficiaries"
                value={formData.currentBeneficiaries || ""}
                onChange={(e) =>
                  handleInputChange(
                    "currentBeneficiaries",
                    parseInt(e.target.value) || 0
                  )
                }
                className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B] resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#54D12B] text-white hover:bg-[#43b71f]"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
