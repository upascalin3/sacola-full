"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  SocioEconomicData,
  SocioEconomicType,
  SOCIO_ECONOMIC_CONFIGS,
  FieldConfig,
} from "@/lib/socio-economic/types";
import {
  ErrorDisplay,
  FormErrorsDisplay,
  FieldError,
} from "@/components/ui/error-display";
import { useToast } from "@/components/ui/toast";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  validateRequired,
  validateDate,
  validateNumber,
  FormErrors,
} from "@/lib/error-handling";

interface CreateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SocioEconomicData) => void;
  socioEconomicType: SocioEconomicType;
  isLoading?: boolean;
}

export default function CreateEntryModal({
  isOpen,
  onClose,
  onSubmit,
  socioEconomicType,
  isLoading = false,
}: CreateEntryModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const config = SOCIO_ECONOMIC_CONFIGS[socioEconomicType];
  const { addToast } = useToast();

  // Initialize form data when socio-economic type changes
  useEffect(() => {
    const initialData: Record<string, any> = {};
    config.fields.forEach((field) => {
      if (field.type === "date") {
        initialData[field.key] = new Date().toISOString().split("T")[0];
      } else if (field.type === "number") {
        initialData[field.key] = 0;
      } else {
        initialData[field.key] = "";
      }
    });
    setFormData(initialData);
    setFormErrors({});
    setGeneralError(null);
  }, [socioEconomicType, config.fields]);

  const handleInputChange = (key: string, value: any) => {
    // Clear field-specific error when user starts typing
    if (formErrors[key]) {
      setFormErrors((prev) => ({ ...prev, [key]: "" }));
    }
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralError(null);

    const newErrors: FormErrors = {};
    // Process form data based on field types
    const processedData = { ...formData };
    config.fields.forEach((field) => {
      if (field.type === "date" && processedData[field.key]) {
        if (field.required) {
          const error = validateRequired(processedData[field.key], field.label);
          if (error) {
            newErrors[field.key] = error;
            return;
          }
        }
        const d = new Date(processedData[field.key]);
        if (isNaN(d.getTime())) {
          newErrors[field.key] = `${field.label} must be a valid date`;
          return;
        } else {
          processedData[field.key] = d;
        }
      }
      if (field.type === "number" && processedData[field.key]) {
        if (field.required) {
          const error = validateRequired(processedData[field.key], field.label);
          if (error) {
            newErrors[field.key] = error;
            return;
          }
        }
        const num = Number(processedData[field.key]);
        if (isNaN(num)) {
          newErrors[field.key] = `${field.label} must be a valid number`;
          return;
        }
        processedData[field.key] = num;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }
    try {
      await onSubmit(processedData as SocioEconomicData);
      addToast({
        type: "success",
        title: "Entry Created",
        message: SUCCESS_MESSAGES.CREATE_SUCCESS,
      });

      // Close modal after showing success toast
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Creation Failed",
        message: error?.message || ERROR_MESSAGES.CREATE_FAILED,
      });
      setGeneralError(error?.message || ERROR_MESSAGES.CREATE_FAILED);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#000000]/30 flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
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
            {config.fields
              .filter((field) => field.type !== "textarea")
              .map((field) => {
                const value = formData[field.key] || "";
                const displayValue =
                  field.type === "date" && value instanceof Date
                    ? value.toISOString().split("T")[0]
                    : value;

                return (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-[#088721]">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    {field.type === "select" ? (
                      <select
                        id={field.key}
                        value={displayValue}
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                        className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:border-transparent ${
                          formErrors[field.key]
                            ? "border-red-300 focus:ring-red-500"
                            : ""
                        }`}
                        required={field.required}
                      >
                        <option value="" disabled>
                          Select {field.label}
                        </option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={displayValue}
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                        className={`bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B] ${
                          formErrors[field.key]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                            : ""
                        }`}
                        required={field.required}
                      />
                    )}
                    <FieldError error={formErrors[field.key]} />
                  </div>
                );
              })}
          </div>

          {config.fields
            .filter((field) => field.type === "textarea")
            .map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-[#088721]">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Textarea
                  id={field.key}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  rows={4}
                  className={`bg-[#F0F8F0] border-gray-300 focus:ring-[#54D12B] focus:border-[#54D12B] resize-none ${
                    formErrors[field.key]
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : ""
                  }`}
                  required={field.required}
                />
                <FieldError error={formErrors[field.key]} />
              </div>
            ))}

          {generalError && (
            <ErrorDisplay
              error={generalError}
              onDismiss={() => setGeneralError(null)}
            />
          )}

          <FormErrorsDisplay
            errors={formErrors}
            onDismiss={() => setFormErrors({})}
          />

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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
