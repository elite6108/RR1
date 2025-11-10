import { useState, useEffect } from 'react';
import type { RAMS } from '../../../../types/database';

export function useModals() {
  const [showRAMSModal, setShowRAMSModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RAMS | null>(null);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = showRAMSModal || showDeleteModal;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showRAMSModal, showDeleteModal]);

  const handleEdit = (entry: RAMS) => {
    setSelectedEntry(entry);
    setShowRAMSModal(true);
  };

  const handleDelete = (entry: RAMS) => {
    setSelectedEntry(entry);
    setShowDeleteModal(true);
  };

  const closeRAMSModal = () => {
    setShowRAMSModal(false);
    setSelectedEntry(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEntry(null);
  };

  const openNewRAMSModal = () => {
    setSelectedEntry(null);
    setShowRAMSModal(true);
  };

  return {
    showRAMSModal,
    showDeleteModal,
    selectedEntry,
    handleEdit,
    handleDelete,
    closeRAMSModal,
    closeDeleteModal,
    openNewRAMSModal
  };
}
