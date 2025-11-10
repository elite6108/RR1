import { useState } from 'react';
import type { CPP } from '../../../../types/database';

export function useCPPModals() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCPP, setSelectedCPP] = useState<CPP | null>(null);

  const openEditModal = (cpp: CPP | null = null) => {
    setSelectedCPP(cpp);
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
    setSelectedCPP(null);
  };

  const openDeleteModal = (cpp: CPP) => {
    setSelectedCPP(cpp);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCPP(null);
  };

  return {
    showModal,
    showDeleteModal,
    selectedCPP,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  };
}
