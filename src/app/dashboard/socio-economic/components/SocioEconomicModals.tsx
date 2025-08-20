"use client"

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  SocioEconomicData,
  ModalAction,
  SocioEconomicType,
  SOCIO_ECONOMIC_CONFIGS,
  FieldConfig
} from '@/lib/socio-economic/types'

interface SocioEconomicModalsProps {
  isOpen: boolean
  onClose: () => void
  action: ModalAction
  socioEconomicType: SocioEconomicType
  data?: SocioEconomicData
  onSubmit?: (data: SocioEconomicData) => void
  onDelete?: () => void
}

export function SocioEconomicModals({
  isOpen,
  onClose,
  action,
  socioEconomicType,
  data,
  onSubmit,
  onDelete
}: SocioEconomicModalsProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const config = SOCIO_ECONOMIC_CONFIGS[socioEconomicType]

  useEffect(() => {
    if (data && (action === 'update' || action === 'details')) {
      setFormData(data as Record<string, any>)
    } else if (action === 'create') {
      const initialData: Record<string, any> = {}
      config.fields.forEach(field => {
        initialData[field.key] = field.type === 'number' ? 0 : ''
      })
      setFormData(initialData)
    }
  }, [data, action, config.fields])

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return

    setIsLoading(true)
    try {
      const processedData = { ...formData }
      config.fields.forEach(field => {
        if (field.type === 'date' && processedData[field.key]) {
          processedData[field.key] = new Date(processedData[field.key])
        }
        if (field.type === 'number' && processedData[field.key] !== undefined && processedData[field.key] !== '') {
          processedData[field.key] = Number(processedData[field.key])
        }
      })

      await onSubmit(processedData as SocioEconomicData)
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return

    setIsLoading(true)
    try {
      await onDelete()
      onClose()
    } catch (error) {
      console.error('Error deleting entry:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderField = (field: FieldConfig) => {
    const value = formData[field.key] || ''
    const isReadonly = action === 'details'

    const displayValue = field.type === 'date' && value instanceof Date
      ? value.toISOString().split('T')[0]
      : value

    return (
      <div key={field.key} className="space-y-2">
        <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">
          {field.label}
          {field.required && !isReadonly && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {field.type === 'textarea' ? (
          <Textarea
            id={field.key}
            value={displayValue}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadonly}
            className="min-h-[100px]"
          />
        ) : field.type === 'select' ? (
          <select
            id={field.key}
            value={displayValue}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            disabled={isReadonly}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:border-transparent"
          >
            <option value="" disabled>Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <Input
            id={field.key}
            type={field.type}
            value={displayValue}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadonly}
          />
        )}
      </div>
    )
  }

  const getModalTitle = () => {
    const baseTitle = config.title
    switch (action) {
      case 'create': return `Create ${baseTitle} Entry`
      case 'update': return `Update ${baseTitle} Entry`
      case 'delete': return `Delete ${baseTitle} Entry`
      case 'details': return `${baseTitle} Details`
      default: return baseTitle
    }
  }

  const renderModalContent = () => {
    if (action === 'delete') {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this {config.title.toLowerCase()} entry?
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          {config.fields.map(renderField)}
        </div>

        {action !== 'details' && (
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? (action === 'create' ? 'Creating...' : 'Updating...')
                : (action === 'create' ? 'Create Entry' : 'Update Entry')
              }
            </Button>
          </div>
        )}

        {action === 'details' && (
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="button"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        )}
      </form>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      className="max-w-2xl"
    >
      {renderModalContent()}
    </Modal>
  )
}

