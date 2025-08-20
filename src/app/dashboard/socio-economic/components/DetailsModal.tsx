"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  SocioEconomicData, 
  SocioEconomicType, 
  SOCIO_ECONOMIC_CONFIGS,
  FieldConfig 
} from '@/lib/socio-economic/types';

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
  const titleValue = config.fields[0] ? dataRecord[config.fields[0].key] : config.title;

  return (
    <div className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl">
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
            if (field.type === 'number' && typeof value === 'number') {
              displayValue = value.toLocaleString();
            } else if (field.type === 'date' && value instanceof Date) {
              displayValue = value.toLocaleDateString();
            } else if (field.type === 'date' && typeof value === 'string') {
              displayValue = new Date(value).toLocaleDateString();
            }
            
            return (
              <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#088721] mb-1">
                    {field.label}
                  </label>
                  <p className="text-gray-900">
                    {displayValue || 'N/A'}
                  </p>
                </div>
              </div>
            );
          })}
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
