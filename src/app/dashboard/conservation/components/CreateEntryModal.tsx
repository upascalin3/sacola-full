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
  FieldConfig,
} from "@/lib/conservation/types";
import {
  ErrorDisplay,
  FormErrorsDisplay,
  SuccessMessage,
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
  onSubmit: (data: ConservationData) => void;
  conservationType: ConservationType;
  isLoading?: boolean;
}

export default function CreateEntryModal({
  isOpen,
  onClose,
  onSubmit,
  conservationType,
  isLoading = false,
}: CreateEntryModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const config = CONSERVATION_CONFIGS[conservationType];
  const { addToast } = useToast();

  // Initialize form data when conservation type changes
  useEffect(() => {
    const initialData: Record<string, any> = {};
    config.fields.forEach((field) => {
      if (field.type === "date") {
        // HTML date inputs expect YYYY-MM-DD
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
  }, [conservationType, config.fields]);

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

    // Process form data based on field types
    const processedData: Record<string, any> = {};
    const newErrors: FormErrors = {};

    for (const field of config.fields) {
      const value = formData[field.key];

      if (field.type === "date") {
        if (field.required) {
          const error = validateRequired(value, field.label);
          if (error) {
            newErrors[field.key] = error;
            continue;
          }
        }

        if (value) {
          const error = validateDate(value);
          if (error) {
            newErrors[field.key] = error;
            continue;
          }
        }

        // Keep as YYYY-MM-DD string to avoid timezone shifts
        processedData[field.key] = value;
      } else if (field.type === "number") {
        if (field.required) {
          const error = validateRequired(value, field.label);
          if (error) {
            newErrors[field.key] = error;
            continue;
          }
        }

        if (value !== "" && value !== null && value !== undefined) {
          const error = validateNumber(value);
          if (error) {
            newErrors[field.key] = error;
            continue;
          }
        }

        processedData[field.key] = value === "" ? 0 : Number(value);
      } else if (field.type === "text" || field.type === "textarea") {
        if (field.required) {
          const error = validateRequired(value, field.label);
          if (error) {
            newErrors[field.key] = error;
            continue;
          }
        }
        processedData[field.key] = value || "";
      }
    }

    // If there are validation errors, display them and stop
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    try {
      await onSubmit(processedData as ConservationData);
      addToast({
        type: "success",
        title: "Entry Created Successfully",
        message: SUCCESS_MESSAGES.CREATE_SUCCESS,
      });

      // Close modal after showing success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      setGeneralError(error?.message || ERROR_MESSAGES.CREATE_FAILED);
    }
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
            {config.fields
              .filter((field) => field.type !== "textarea")
              .map((field) => {
                const value = formData[field.key] || "";

                return (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-[#088721]">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    <Input
                      id={field.key}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={value}
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
