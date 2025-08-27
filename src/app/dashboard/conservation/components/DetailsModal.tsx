"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ConservationData,
  ConservationType,
  CONSERVATION_CONFIGS,
  FieldConfig,
} from "@/lib/conservation/types";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ConservationData | null;
  onEdit: () => void;
  onDelete: () => void;
  conservationType: ConservationType;
}

export default function DetailsModal({
  isOpen,
  onClose,
  data,
  onEdit,
  onDelete,
  conservationType,
}: DetailsModalProps) {
  if (!isOpen || !data) return null;

  const config = CONSERVATION_CONFIGS[conservationType];
  const dataRecord = data as Record<string, any>;

  // Use the first field as title unless it's a date; for date-first configs (e.g., Buffalo Wall), use the section title instead
  const firstField = config.fields[0];
  const titleValue = firstField && firstField.type !== 'date'
    ? dataRecord[firstField.key]
    : config.title;

  return (
    <div
      className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[80vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#54D12B]">{titleValue}</h2>
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
          {config.fields.map((field, index) => {
            const value = dataRecord[field.key];
            let displayValue = value;

            // Format different field types
            if (field.type === "number" && typeof value === "number") {
              displayValue = value.toLocaleString();
            } else if (field.type === "date") {
              if (value instanceof Date && !isNaN(value.getTime())) {
                displayValue = value.toISOString().split('T')[0];
              } else if (typeof value === "string") {
                // Expecting YYYY-MM-DD; format robustly
                const d = new Date(value);
                displayValue = isNaN(d.getTime()) ? value : d.toISOString().split('T')[0];
              }
            }

            return (
              <div
                key={field.key}
                className={field.type === "textarea" ? "col-span-2" : ""}
              >
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#088721] mb-1">
                    {field.label}
                  </label>
                  <p className="text-gray-900">{displayValue || "N/A"}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions moved to table action column; no footer buttons here */}
      </div>
    </div>
  );
}
