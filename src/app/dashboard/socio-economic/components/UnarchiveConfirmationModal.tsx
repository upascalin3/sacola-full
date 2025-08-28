"use client";

import React from "react";
import { X, ArchiveX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SocioEconomicType,
  SOCIO_ECONOMIC_CONFIGS,
} from "@/lib/socio-economic/types";

interface UnarchiveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  socioEconomicType: SocioEconomicType;
  itemName?: string;
}

export default function UnarchiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  socioEconomicType,
  itemName,
}: UnarchiveConfirmationModalProps) {
  if (!isOpen) return null;

  const config = SOCIO_ECONOMIC_CONFIGS[socioEconomicType];
  const displayName = itemName || `this ${config.title.toLowerCase()} entry`;

  return (
    <div
      className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ArchiveX size={20} className="text-green-600" />
            Unarchive Confirmation
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
            Are you sure you want to unarchive {displayName}? This will move it back to the active list.
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
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Unarchive
          </Button>
        </div>
      </div>
    </div>
  );
}
