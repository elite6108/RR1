import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, AlertTriangle, X } from 'lucide-react';
import { LeadManagementProps, Lead } from '../shared/types';
import { useLeadManagement } from '../../hooks/useLeadManagement';
import { preventBodyScroll } from '../shared/utils';
import { LeadStatistics } from './components/LeadStatistics';
import { LeadSearchBar } from './components/LeadSearchBar';
import { LeadTable } from './components/LeadTable';
import { LeadForm } from '../LeadForm/LeadForm';

export function LeadManagement({ onBack }: LeadManagementProps) {
  const {
    leads,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    fetchLeads,
    deleteLead,
    setError,
  } = useLeadManagement();

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [activityLeadId, setActivityLeadId] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showLeadForm || !!leadToEdit || !!leadToDelete || !!activityLeadId;
    preventBodyScroll(isModalOpen);

    // Cleanup function to restore scroll when component unmounts
    return () => {
      preventBodyScroll(false);
    };
  }, [showLeadForm, leadToEdit, leadToDelete, activityLeadId]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLead(id);
      setLeadToDelete(null); // Close modal on success
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  const handleRowClick = (lead: Lead, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on action buttons
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('svg')) {
      return;
    }
    
    setLeadToEdit(lead);
  };

  const handleActivityClick = (leadId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActivityLeadId(leadId);
  };

  const handleEditClick = (lead: Lead, event: React.MouseEvent) => {
    event.stopPropagation();
    setLeadToEdit(lead);
  };

  const handleDeleteClick = (lead: Lead, event: React.MouseEvent) => {
    event.stopPropagation();
    setLeadToDelete(lead);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Quote Management
        </button>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Lead Management</h2>

      {/* Statistics Widgets */}
      <LeadStatistics leads={leads} />

      {/* Search Bar and Controls */}
      <LeadSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddLead={() => setShowLeadForm(true)}
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Content - Table View */}
      <LeadTable
        leads={leads}
        loading={loading}
        searchTerm={searchTerm}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={handleRowClick}
        onActivityClick={handleActivityClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {/* Add New Lead Form Modal */}
      {showLeadForm && createPortal(
        <LeadForm
          onClose={() => setShowLeadForm(false)}
          onSuccess={() => {
            setShowLeadForm(false);
            fetchLeads();
          }}
        />,
        document.body
      )}

      {/* Edit Lead Form Modal */}
      {leadToEdit && createPortal(
        <LeadForm
          leadToEdit={leadToEdit}
          onClose={() => setLeadToEdit(null)}
          onSuccess={() => {
            setLeadToEdit(null);
            fetchLeads();
          }}
        />,
        document.body
      )}

      {/* Activity Modal */}
      {activityLeadId && createPortal(
        <LeadForm
          leadToEdit={leads.find(l => l.id === activityLeadId) || null}
          onClose={() => setActivityLeadId(null)}
          onSuccess={() => {
            setActivityLeadId(null);
            fetchLeads();
          }}
          initialStep={2}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Lead
              </h3>
              <button
                onClick={() => setLeadToDelete(null)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete {leadToDelete.name}? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setLeadToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLead(leadToDelete.id)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
