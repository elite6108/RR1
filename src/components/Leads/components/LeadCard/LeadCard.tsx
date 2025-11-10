import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Phone } from 'lucide-react';
import { LeadCardProps } from '../shared/types';
import { STATUS_COLORS, BORDER_COLORS } from '../shared/constants';
import { formatDateShort, formatCurrency, getDisplayStatus, getDisplayStatusText, scrollToTopOnMobile, preventBodyScroll } from '../shared/utils';
import { supabase } from '../../../../lib/supabase';
import { LeadCardActions } from './LeadCardActions';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { LeadForm } from '../LeadForm/LeadForm';

export function LeadCard({ lead, onUpdate }: LeadCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showDeleteModal || showEditModal;
    preventBodyScroll(isModalOpen);

    // Cleanup function to restore scroll when component unmounts
    return () => {
      preventBodyScroll(false);
    };
  }, [showDeleteModal, showEditModal]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from('leads').delete().eq('id', lead.id);

      if (error) throw error;
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleCardClick = () => {
    setShowEditModal(true);
    scrollToTopOnMobile();
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // Map hot status to sent for display
  const displayStatus = getDisplayStatus(lead.status);
  const displayStatusText = getDisplayStatusText(lead.status);

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 border-l-4 ${BORDER_COLORS[displayStatus as keyof typeof BORDER_COLORS]} hover:shadow-md transition-shadow cursor-pointer relative`}
      >
        {/* Absolute positioned value and date in top right */}
        <div className="absolute top-4 right-4 flex flex-col items-end text-right space-y-1">
          {/* Value */}
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrency(lead.budget || '0')}
          </div>
          
          {/* Date */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDateShort(lead.created_at)}
          </div>
        </div>

        {/* Header with action buttons */}
        <div className="flex justify-end mb-2 mr-20">
          <LeadCardActions 
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>

        {/* Main content - Lead details */}
        <div className="pr-24">
          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight mb-2">
            {lead.name}
          </h3>
          
          {/* Company - only show if company exists */}
          {lead.company && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span className="text-gray-400 mr-2">🏢</span>
              <span className="truncate">{lead.company}</span>
            </div>
          )}
          
          {/* Email */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span className="text-gray-400 mr-2">@</span>
            <span className="truncate">{lead.email}</span>
          </div>
          
          {/* Phone */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
            <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
            <span>{lead.phone}</span>
          </div>
        </div>

        {/* Status badge at bottom */}
        <div className="mt-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              STATUS_COLORS[displayStatus as keyof typeof STATUS_COLORS]
            }`}
          >
            {displayStatusText}
          </span>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-xs text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && createPortal(
        <DeleteConfirmationModal
          leadName={lead.name}
          loading={loading}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />,
        document.body
      )}

      {/* Edit Modal */}
      {showEditModal && createPortal(
        <LeadForm
          leadToEdit={lead}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onUpdate();
          }}
        />,
        document.body
      )}
    </>
  );
}
