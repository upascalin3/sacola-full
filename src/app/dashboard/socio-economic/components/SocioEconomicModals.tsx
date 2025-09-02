"use client";

import React, { useEffect, useState } from "react";
import {
  SocioEconomicData,
  ModalAction,
  SocioEconomicType,
} from "@/lib/socio-economic/types";
import CreateEntryModal from "./CreateEntryModal";
import UpdateEntryModal from "./UpdateEntryModal";
import DetailsModal from "./DetailsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface SocioEconomicModalsProps {
  isOpen: boolean;
  onClose: () => void;
  action: ModalAction;
  socioEconomicType: SocioEconomicType;
  data?: SocioEconomicData;
  onSubmit?: (data: SocioEconomicData) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function SocioEconomicModals({
  isOpen,
  onClose,
  action,
  socioEconomicType,
  data,
  onSubmit,
  onDelete,
  isLoading = false,
}: SocioEconomicModalsProps) {
  const [visibleAction, setVisibleAction] = useState<ModalAction>(action);
  const [open, setOpen] = useState<boolean>(isOpen);

  useEffect(() => {
    setVisibleAction(action);
    setOpen(isOpen);
  }, [action, isOpen, data]);

  const close = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = async (payload: SocioEconomicData) => {
    await onSubmit?.(payload);
    close();
  };

  const handleDelete = async () => {
    await onDelete?.();
    close();
  };

  const handleEditFromDetails = () => setVisibleAction("update");
  const handleDeleteFromDetails = () => setVisibleAction("delete");

  return (
    <>
      <CreateEntryModal
        isOpen={open && visibleAction === "create"}
        onClose={close}
        onSubmit={handleSubmit}
        socioEconomicType={socioEconomicType}
        isLoading={isLoading}
      />

      <UpdateEntryModal
        isOpen={open && visibleAction === "update"}
        onClose={close}
        onSubmit={handleSubmit}
        initialData={data ?? null}
        socioEconomicType={socioEconomicType}
        key={`update-${(data as any)?.id || "new"}`}
        isLoading={isLoading}
      />

      <DetailsModal
        isOpen={open && visibleAction === "details"}
        onClose={close}
        data={data ?? null}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
        socioEconomicType={socioEconomicType}
      />

      <DeleteConfirmationModal
        isOpen={open && visibleAction === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        socioEconomicType={socioEconomicType}
        isLoading={isLoading}
      />
    </>
  );
}
