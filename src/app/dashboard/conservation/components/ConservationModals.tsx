"use client";

import React, { useEffect, useState } from "react";
import {
  ConservationData,
  ModalAction,
  ConservationType,
} from "@/lib/conservation/types";
import CreateEntryModal from "./CreateEntryModal";
import UpdateEntryModal from "./UpdateEntryModal";
import DetailsModal from "./DetailsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ConservationModalsProps {
  isOpen: boolean;
  onClose: () => void;
  action: ModalAction;
  conservationType: ConservationType;
  data?: ConservationData;
  onSubmit?: (data: ConservationData) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function ConservationModals({
  isOpen,
  onClose,
  action,
  conservationType,
  data,
  onSubmit,
  onDelete,
  isLoading = false,
}: ConservationModalsProps) {
  const [visibleAction, setVisibleAction] = useState<ModalAction>(action);
  const [open, setOpen] = useState<boolean>(isOpen);

  useEffect(() => {
    setVisibleAction(action);
    setOpen(isOpen);
  }, [action, isOpen]);

  const close = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = (payload: ConservationData) => {
    onSubmit?.(payload);
    close();
  };

  const handleDelete = () => {
    onDelete?.();
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
        conservationType={conservationType}
        isLoading={isLoading}
      />

      <UpdateEntryModal
        isOpen={open && visibleAction === "update"}
        onClose={close}
        onSubmit={handleSubmit}
        initialData={data ?? null}
        conservationType={conservationType}
      />

      <DetailsModal
        isOpen={open && visibleAction === "details"}
        onClose={close}
        data={data ?? null}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
        conservationType={conservationType}
      />

      <DeleteConfirmationModal
        isOpen={open && visibleAction === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        conservationType={conservationType}
      />
    </>
  );
}
