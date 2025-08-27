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

interface CreateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ConservationData) => void;
  conservationType: ConservationType;
}

export default function CreateEntryModal({
  isOpen,
  onClose,
  onSubmit,
  conservationType,
}: CreateEntryModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formError, setFormError] = useState<string>("");
  const config = CONSERVATION_CONFIGS[conservationType];

  // Initialize form data when conservation type changes
  useEffect(() => {
    const initialData: Record<string, any> = {};
    config.fields.forEach(field => {
      if (field.type === 'date') {
        // HTML date inputs expect YYYY-MM-DD
        initialData[field.key] = new Date().toISOString().split('T')[0];
      } else if (field.type === 'number') {
        initialData[field.key] = 0;
      } else {
        initialData[field.key] = '';
      }
    });
    setFormData(initialData);
    setFormError("");
  }, [conservationType, config.fields]);

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
    
    console.log('Raw form data before processing:', formData);
    console.log('Field configurations:', config.fields);
    
    for (const field of config.fields) {
      const value = formData[field.key];
      console.log(`Processing field ${field.key}:`, { value, type: typeof value, fieldType: field.type });
      
      if (field.type === 'date') {
        if (!value) {
          setFormError(`${field.label} is required`);
          return;
        }
        console.log(`Processing date field ${field.key}:`, { value, type: typeof value });
        // Expecting YYYY-MM-DD from input; validate format and value
        const isDateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
        const d = new Date(value);
        const isValid = !isNaN(d.getTime());
        console.log(`Date validation:`, { isDateOnly, isValid, parsed: d.toISOString() });
        if (!isValid) {
          setFormError(`${field.label} must be a valid date`);
          return;
        }
        // Keep as YYYY-MM-DD string to avoid timezone shifts
        processedData[field.key] = isDateOnly ? value : d.toISOString().split('T')[0];
        console.log(`Final date value for ${field.key}:`, processedData[field.key]);
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
    
    console.log('Form submitting data:', processedData);
    console.log('Form data types:', Object.entries(processedData).map(([key, value]) => ({ key, value, type: typeof value, isDate: value instanceof Date })));
    onSubmit(processedData as ConservationData);
    onClose();
    
    // Reset form
    const initialData: Record<string, any> = {};
    config.fields.forEach(field => {
      if (field.type === 'date') {
        initialData[field.key] = new Date().toISOString().split('T')[0];
      } else if (field.type === 'number') {
        initialData[field.key] = 0;
      } else {
        initialData[field.key] = '';
      }
    });
    setFormData(initialData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#088721]">
            Create {config.title} Entry
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
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
