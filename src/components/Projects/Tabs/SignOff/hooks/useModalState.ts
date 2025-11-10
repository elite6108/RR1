import { useState, useEffect } from 'react';
import { SignOff } from '../types';

export function useModalState() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [signoffToDelete, setSignoffToDelete] = useState<SignOff | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showDeleteModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      // Scroll to top of viewport when modal opens
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDeleteModal]);

  const openDeleteModal = (signoff: SignOff) => {
    setSignoffToDelete(signoff);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSignoffToDelete(null);
  };

  return {
    showDeleteModal,
    signoffToDelete,
    openDeleteModal,
    closeDeleteModal
  };
}
