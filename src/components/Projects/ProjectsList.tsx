import React from 'react';
import { Plus, AlertTriangle, Search, ChevronLeft } from 'lucide-react';
import { createPortal } from 'react-dom';
import { ProjectForm } from './ProjectForm';
import { useProjectData } from './Projects/hooks/useProjectData';
import { ProjectsTable } from './Projects/components/ProjectsTable';
import { ProjectCards } from './Projects/components/ProjectCards';
import { ProjectDetail } from './Projects/components/ProjectDetail';
import { DeleteModal } from './Projects/components/DeleteModal';
import type { ProjectsListProps, Project } from './Projects/types';



export function ProjectsList({
  projects,
  onProjectChange,
  setShowCustomerProjectsDashboard,
  setActiveSection,
}: ProjectsListProps) {
  const {
    // State
    showProjectModal,
    setShowProjectModal,
    showDeleteModal,
    setShowDeleteModal,
    projectToDelete,
    setProjectToDelete,
    projectToEdit,
    setProjectToEdit,
    loading,
    error,
    selectedProject,
    setSelectedProject,
    projectOrders,
    loadingOrders,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    projectQuotes,
    loadingQuotes,
    projectSites,
    loadingSites,
    projectRams,
    loadingRams,
    projectCpp,
    loadingCpp,
    projectContracts,
    loadingContracts,
    projectSiteSurveys,
    loadingSiteSurveys,
    projectFiles,
    loadingFiles,
    
    // Functions
    handleDeleteProject,
    handleEditProject,
    confirmDelete,
    fetchSites,
    fetchRams,
    fetchCpp,
    fetchContracts,
    fetchSiteSurveys,
    fetchFiles,
    handleProjectClick,
  } = useProjectData();

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    return (
      project.name?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.location?.toLowerCase().includes(query)
    );
  });

  const handleConfirmDelete = async () => {
    const success = await confirmDelete();
    if (success) {
      onProjectChange();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  if (selectedProject) {
    return (
      <ProjectDetail
        selectedProject={selectedProject}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectOrders={projectOrders}
        projectQuotes={projectQuotes}
        projectSites={projectSites}
        projectRams={projectRams}
        projectCpp={projectCpp}
        projectContracts={projectContracts}
        projectSiteSurveys={projectSiteSurveys}
        projectFiles={projectFiles}
        loadingOrders={loadingOrders}
        loadingQuotes={loadingQuotes}
        loadingSites={loadingSites}
        loadingRams={loadingRams}
        loadingCpp={loadingCpp}
        loadingContracts={loadingContracts}
        loadingSiteSurveys={loadingSiteSurveys}
        loadingFiles={loadingFiles}
        onProjectClick={handleProjectClick}
        onSetSelectedProject={setSelectedProject}
        fetchSites={fetchSites}
        fetchRams={fetchRams}
        fetchCpp={fetchCpp}
        fetchContracts={fetchContracts}
        fetchSiteSurveys={fetchSiteSurveys}
        fetchFiles={fetchFiles}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={() => {
            setShowCustomerProjectsDashboard(true);
            setActiveSection('customers');
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Admin Section
        </button>
      </div>
    
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Projects Management</h2>
      </div>

      {/* Search Box with Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name, description or location..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={() => {
              setProjectToEdit(null);
              setShowProjectModal(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Projects Table and Cards */}
      <ProjectsTable
        projects={filteredProjects}
        loading={loading}
        onProjectClick={handleProjectClick}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />
      
      <ProjectCards
        projects={filteredProjects}
        loading={loading}
        onProjectClick={handleProjectClick}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Project Form Modal */}
      {showProjectModal && createPortal(
        <ProjectForm
          onClose={() => {
            setShowProjectModal(false);
            setProjectToEdit(null);
          }}
          onSuccess={() => {
            onProjectChange();
            setShowProjectModal(false);
            setProjectToEdit(null);
          }}
          projectToEdit={projectToEdit}
        />,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        showDeleteModal={showDeleteModal}
        loading={loading}
        onConfirmDelete={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
