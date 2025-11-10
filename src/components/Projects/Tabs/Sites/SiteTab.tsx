import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useSiteActions } from './hooks/useSiteActions';
import { downloadQRCode } from './utils/qrCodeGenerator';
import { AddSiteModal, EditSiteModal, DeleteSiteModal, SitesTable } from './components';
import type { SitesTabProps } from './types';

export function SitesTab({ project, sites, isLoading, onSitesChange }: SitesTabProps) {
  const [sitesSearchQuery, setSitesSearchQuery] = useState('');
  
  const {
    showAddModal,
    showEditModal,
    showDeleteModal,
    siteToEdit,
    siteToDelete,
    newSite,
    currentStep,
    setNewSite,
    setSiteToEdit,
    nextStep,
    prevStep,
    handleAddSite,
    handleEditSite,
    handleDeleteSite,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeAddModal,
    closeEditModal,
    closeDeleteModal,
  } = useSiteActions({ projectId: project.id, onSitesChange });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Sites</h2>

      {/* Search and Add button row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={sitesSearchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSitesSearchQuery(e.target.value)}
            placeholder="Search by name, address, town, county, postcode, site manager or phone..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Site
        </button>
      </div>

      {/* Sites Table/Cards */}
      <SitesTable
        sites={sites}
        searchQuery={sitesSearchQuery}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onDownloadQR={downloadQRCode}
      />

      {/* Add Site Modal */}
      <AddSiteModal
        isOpen={showAddModal}
        currentStep={currentStep}
        newSite={newSite}
        onClose={closeAddModal}
        onSubmit={handleAddSite}
        onSiteChange={setNewSite}
        onNextStep={nextStep}
        onPrevStep={prevStep}
      />

      {/* Edit Site Modal */}
      <EditSiteModal
        isOpen={showEditModal}
        currentStep={currentStep}
        siteToEdit={siteToEdit}
        onClose={closeEditModal}
        onSubmit={handleEditSite}
        onSiteChange={setSiteToEdit}
        onNextStep={nextStep}
        onPrevStep={prevStep}
      />

      {/* Delete Confirmation Modal */}
      <DeleteSiteModal
        isOpen={showDeleteModal}
        siteToDelete={siteToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteSite}
      />
    </div>
  );
}