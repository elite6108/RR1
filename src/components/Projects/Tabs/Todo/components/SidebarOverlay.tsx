import React from 'react';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarOverlay: React.FC<SidebarOverlayProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    />
  );
};
