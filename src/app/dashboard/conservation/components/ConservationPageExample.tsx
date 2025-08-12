"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { ConservationModals } from './ConservationModals'
import { useConservationModals } from './useConservationModals'
import { ConservationData, ConservationType } from '@/lib/conservation/types'

interface ConservationPageExampleProps {
  conservationType: ConservationType
  entries?: ConservationData[]
  onCreateEntry?: (data: ConservationData) => Promise<void>
  onUpdateEntry?: (data: ConservationData) => Promise<void>
  onDeleteEntry?: (data: ConservationData) => Promise<void>
}

export function ConservationPageExample({
  conservationType,
  entries = [],
  onCreateEntry,
  onUpdateEntry,
  onDeleteEntry
}: ConservationPageExampleProps) {
  const {
    modalState,
    openCreateModal,
    openUpdateModal,
    openDeleteModal,
    openDetailsModal,
    closeModal
  } = useConservationModals()

  const handleCreateEntry = async (data: ConservationData) => {
    if (onCreateEntry) {
      await onCreateEntry(data)
    }
    // You can add additional logic here like refreshing the entries list
  }

  const handleUpdateEntry = async (data: ConservationData) => {
    if (onUpdateEntry) {
      await onUpdateEntry(data)
    }
    // You can add additional logic here like refreshing the entries list
  }

  const handleDeleteEntry = async () => {
    if (onDeleteEntry && modalState.data) {
      await onDeleteEntry(modalState.data)
    }
    // You can add additional logic here like refreshing the entries list
  }

  const renderEntryCard = (entry: ConservationData, index: number) => {
    // This is a generic way to display any conservation entry
    const entryData = entry as Record<string, any>
    
    return (
      <Card key={index} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">
            Entry #{index + 1}
          </CardTitle>
          <CardAction>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDetailsModal(entry)}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openUpdateModal(entry)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => openDeleteModal(entry)}
              >
                Delete
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(entryData).map(([key, value]) => {
              if (value === null || value === undefined || value === '') return null
              
              let displayValue = value
              if (value instanceof Date) {
                displayValue = value.toLocaleDateString()
              }
              
              return (
                <div key={key} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-gray-900">{String(displayValue)}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Conservation Entries</h2>
          <p className="text-gray-600 mt-1">
            Manage your {conservationType} conservation entries
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#54D12B] hover:bg-[#54D12B]/90">
          Create New Entry
        </Button>
      </div>

      {/* Entries Grid */}
      {entries.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map(renderEntryCard)}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No entries yet</h3>
                <p className="text-gray-500 mt-1">
                  Get started by creating your first conservation entry.
                </p>
              </div>
              <Button onClick={openCreateModal} className="bg-[#54D12B] hover:bg-[#54D12B]/90">
                Create First Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Modal */}
      <ConservationModals
        isOpen={modalState.isOpen}
        onClose={closeModal}
        action={modalState.action}
        conservationType={conservationType}
        data={modalState.data}
        onSubmit={modalState.action === 'create' ? handleCreateEntry : handleUpdateEntry}
        onDelete={handleDeleteEntry}
      />
    </div>
  )
}
