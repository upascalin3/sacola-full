"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SocioEconomicData,
  SocioEconomicType,
  SOCIO_ECONOMIC_CONFIGS,
  FieldConfig,
} from "@/lib/socio-economic/types";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SocioEconomicData | null;
  onEdit: () => void;
  onDelete: () => void;
  socioEconomicType: SocioEconomicType;
}

export default function DetailsModal({
  isOpen,
  onClose,
  data,
  onEdit,
  onDelete,
  socioEconomicType,
}: DetailsModalProps) {
  if (!isOpen || !data) return null;

  const config = SOCIO_ECONOMIC_CONFIGS[socioEconomicType];
  const dataRecord = data as Record<string, any>;

  // Get the first field value as the title (or use socioeconomic type title)
  const titleValue = config.fields[0]
    ? dataRecord[config.fields[0].key]
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
                displayValue = value.toISOString().split("T")[0];
              } else if (typeof value === "string") {
                displayValue = value.includes("T")
                  ? value.split("T")[0]
                  : value;
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

          {socioEconomicType === "housingVillages" && (
            <div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#088721] mb-1">
                  Total Houses
                </label>
                <p className="text-gray-900">
                  {(() => {
                    const good = Number(dataRecord.goodCondition || 0);
                    const bad = Number(dataRecord.badCondition || 0);
                    const total = good + bad;
                    return Number.isFinite(total)
                      ? total.toLocaleString()
                      : "N/A";
                  })()}
                </p>
              </div>
            </div>
          )}

          {socioEconomicType === "livestock" && (
            <div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#088721] mb-1">
                  Currently Owned
                </label>
                <p className="text-gray-900">
                  {(() => {
                    const distributed = Number(
                      dataRecord.distributedAnimals || 0
                    );
                    const born = Number(dataRecord.born || 0);
                    const sold = Number(dataRecord.soldAnimals || 0);
                    const transferred = Number(
                      dataRecord.transferredAnimals || 0
                    );
                    const deaths = Number(dataRecord.deaths || 0);
                    const fromRecord = dataRecord.currentlyOwned;
                    const computed =
                      distributed + born - sold - transferred - deaths;
                    const value =
                      typeof fromRecord === "number" ? fromRecord : computed;
                    return Number.isFinite(value)
                      ? value.toLocaleString()
                      : "N/A";
                  })()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions moved to table action column; no footer buttons here */}
      </div>
    </div>
  );
}
