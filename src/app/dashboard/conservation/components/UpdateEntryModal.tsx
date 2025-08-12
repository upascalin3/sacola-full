"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ConservationData, 
  ConservationType, 
  CONSERVATION_CONFIGS,
  FieldConfig 
} from '@/lib/conservation/types';

interface UpdateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ConservationData) => void;
  initialData: ConservationData | null;
  conservationType: ConservationType;
}

export default function UpdateEntryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  conservationType,
}: UpdateEntryModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const config = CONSERVATION_CONFIGS[conservationType];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData as Record<string, any>);
    } else {
      // Initialize with empty values
      const initialFormData: Record<string, any> = {};
      config.fields.forEach(field => {
        initialFormData[field.key] = field.type === 'number' ? 0 : '';
      });
      setFormData(initialFormData);
    }
  }, [initialData, config.fields]);

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process form data based on field types
    const processedData = { ...formData };
    config.fields.forEach(field => {
      if (field.type === 'date' && processedData[field.key]) {
        processedData[field.key] = new Date(processedData[field.key]);
      }
      if (field.type === 'number' && processedData[field.key]) {
        processedData[field.key] = Number(processedData[field.key]);
      }
    });
    
    onSubmit(processedData as ConservationData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Update {config.title} Entry</h2>
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
            {config.fields.filter(field => field.type !== 'textarea').map((field) => {
              const value = formData[field.key] || '';
              const displayValue = field.type === 'date' && value instanceof Date 
                ? value.toISOString().split('T')[0]
                : value;

              return (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-[#088721]">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={displayValue}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B]"
                    required={field.required}
                  />
                </div>
              );
            })}
          </div>

          {config.fields.filter(field => field.type === 'textarea').map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-[#088721]">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Textarea
                id={field.key}
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                rows={4}
                className="bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B] resize-none"
                required={field.required}
              />
            </div>
          ))}

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
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
