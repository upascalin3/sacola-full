"use client"

import { useState } from 'react'
import { ConservationData, ModalAction, ConservationType } from '@/lib/conservation/types'

interface ModalState {
  isOpen: boolean
  action: ModalAction
  data?: ConservationData
}

export function useConservationModals() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    action: 'create'
  })

  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      action: 'create',
      data: undefined
    })
  }

  const openUpdateModal = (data: ConservationData) => {
    setModalState({
      isOpen: true,
      action: 'update',
      data
    })
  }

  const openDeleteModal = (data: ConservationData) => {
    setModalState({
      isOpen: true,
      action: 'delete',
      data
    })
  }

  const openDetailsModal = (data: ConservationData) => {
    setModalState({
      isOpen: true,
      action: 'details',
      data
    })
  }

  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }))
  }

  return {
    modalState,
    openCreateModal,
    openUpdateModal,
    openDeleteModal,
    openDetailsModal,
    closeModal
  }
}
