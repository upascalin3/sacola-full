"use client";

import { useState } from "react";
import { SocioEconomicData, ModalAction } from "@/lib/socio-economic/types";

interface ModalState {
  isOpen: boolean;
  action: ModalAction;
  data?: SocioEconomicData;
}

export function useSocioEconomicModals() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    action: "create",
  });

  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      action: "create",
      data: undefined,
    });
  };

  const openUpdateModal = (data: SocioEconomicData) => {
    setModalState({
      isOpen: true,
      action: "update",
      data,
    });
  };

  const openDeleteModal = (data: SocioEconomicData) => {
    setModalState({
      isOpen: true,
      action: "delete",
      data,
    });
  };

  const openDetailsModal = (data: SocioEconomicData) => {
    setModalState({
      isOpen: true,
      action: "details",
      data,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return {
    modalState,
    openCreateModal,
    openUpdateModal,
    openDeleteModal,
    openDetailsModal,
    closeModal,
  };
}
