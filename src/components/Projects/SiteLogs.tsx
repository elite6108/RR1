import React from 'react';
import { useSiteLists } from './Site/hooks/useSiteLists';
import { SiteListView } from './Site/components/SiteListView';
import { SiteLogsView } from './Site/components/SiteLogsView';
import { AddSiteModal } from './Site/components/modals/AddSiteModal';
import { EditSiteModal } from './Site/components/modals/EditSiteModal';
import { DeleteSiteModal } from './Site/components/modals/DeleteSiteModal';
import { What3WordsModal } from './Site/components/modals/What3WordsModal';
import { SiteListsProps } from './Site/types';

export function SiteLogs({
  setShowCustomerProjectsDashboard,
  setActiveSection,
}: SiteListsProps) {
  const {
    // State
    sites,
    selectedSiteId,
    siteLogs,
    showAddModal,
    showEditModal,
    showDeleteModal,
    siteToEdit,
    siteToDelete,
    searchQuery,
    projects,
    newSite,
    currentView,
    currentStep,
    showW3WModal,
    filteredSites,
    
    // Setters
    setSearchQuery,
    setShowAddModal,
    setShowDeleteModal,
    setSiteToDelete,
    
    // Handlers
    handleAddSite,
    handleEditSite,
    handleDeleteSite,
    openEditModal,
    openDeleteModal,
    handleSiteClick,
    handleBackToList,
    prevStep,
    openW3WModal,
    closeW3WModal,
    handleSiteChange,
    closeAddModal,
    closeEditModal,
  } = useSiteLists();

  // Show site logs view if a site is selected
  if (currentView === 'logs' && selectedSiteId) {
    const site = sites.find((s) => s.id === selectedSiteId);
    if (!site) return null;

    return (
      <SiteLogsView
        site={site}
        siteLogs={siteLogs}
        onBackToList={handleBackToList}
      />
    );
  }

  // Show main site list view
  return (
    <>
      <SiteListView
        sites={filteredSites}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSiteClick={handleSiteClick}
        onEditSite={openEditModal}
        onDeleteSite={openDeleteModal}
        onShowAddModal={() => setShowAddModal(true)}
        setShowCustomerProjectsDashboard={setShowCustomerProjectsDashboard}
        setActiveSection={setActiveSection}
      />

      {/* Add Site Modal */}
      <AddSiteModal
        isOpen={showAddModal}
        currentStep={currentStep}
        newSite={newSite}
        projects={projects}
        onClose={closeAddModal}
              onSubmit={handleAddSite}
        onSiteChange={handleSiteChange}
        onPrevStep={prevStep}
        onOpenW3WModal={openW3WModal}
      />

      {/* Edit Site Modal */}
      <EditSiteModal
        isOpen={showEditModal}
        currentStep={currentStep}
        site={siteToEdit}
        newSite={newSite}
        projects={projects}
        onClose={closeEditModal}
        onSubmit={handleEditSite}
        onSiteChange={handleSiteChange}
        onPrevStep={prevStep}
        onOpenW3WModal={openW3WModal}
      />

      {/* Delete Site Modal */}
      <DeleteSiteModal
        isOpen={showDeleteModal}
        site={siteToDelete}
        onConfirm={handleDeleteSite}
        onCancel={() => {
          setShowDeleteModal(false);
          setSiteToDelete(null);
        }}
      />

      {/* What3Words Modal */}
      <What3WordsModal
        isOpen={showW3WModal}
        onClose={closeW3WModal}
      />
    </>
  );
}
