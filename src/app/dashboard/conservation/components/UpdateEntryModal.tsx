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
  const [formError, setFormError] = useState<string>("");
  const config = CONSERVATION_CONFIGS[conservationType];

  useEffect(() => {
    if (initialData) {
      const processedData: Record<string, any> = {};
      config.fields.forEach(field => {
        const value = (initialData as any)[field.key];
        if (field.type === 'date' && value instanceof Date) {
          processedData[field.key] = value.toISOString().split('T')[0];
        } else {
          processedData[field.key] = value || '';
        }
      });
      setFormData(processedData);
    } else {
      // Initialize with empty values
      const initialFormData: Record<string, any> = {};
      config.fields.forEach(field => {
        if (field.type === 'date') {
          initialFormData[field.key] = new Date().toISOString().split('T')[0];
        } else if (field.type === 'number') {
          initialFormData[field.key] = 0;
        } else {
          initialFormData[field.key] = '';
        }
      });
      setFormData(initialFormData);
    }
    setFormError("");
  }, [initialData, config.fields]);

  const handleInputChange = (key: string, value: any) => {
    setFormError("");
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    // Process form data based on field types
    const processedData: Record<string, any> = {};
    
    for (const field of config.fields) {
      const value = formData[field.key];
      
      if (field.type === 'date') {
        if (!value) {
          setFormError(`${field.label} is required`);
          return;
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          setFormError(`${field.label} must be a valid date`);
          return;
        }
        processedData[field.key] = date;
      } else if (field.type === 'number') {
        if (field.required && (value === '' || value === null || value === undefined)) {
          setFormError(`${field.label} is required`);
          return;
        }
        const num = Number(value);
        if (field.required && isNaN(num)) {
          setFormError(`${field.label} must be a valid number`);
          return;
        }
        processedData[field.key] = isNaN(num) ? 0 : num;
      } else if (field.type === 'text' || field.type === 'textarea') {
        if (field.required && (!value || value.trim() === '')) {
          setFormError(`${field.label} is required`);
          return;
        }
        processedData[field.key] = value || '';
      }
    }
    
    // Preserve the original ID for updates
    if (initialData) {
      processedData.id = (initialData as any).id;
    }
    
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
                    value={value}
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

          {formError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {formError}
            </div>
          )}

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
