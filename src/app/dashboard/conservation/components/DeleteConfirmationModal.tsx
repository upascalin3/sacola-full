"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this entry",
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Delete Confirmation
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </Button>
        </div>

        <div className="mb-8">
          <p className="text-gray-700 text-center">
            Are you sure you want to delete {itemName}?
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-[#54D12B] text-white hover:bg-[#43b71f]"
          >
            Okay
          </Button>
        </div>
      </div>
    </div>
  );
}
