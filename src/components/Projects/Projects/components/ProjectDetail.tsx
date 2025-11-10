import React from 'react';
import { ChevronLeft, FileText, Calendar, ShoppingCart, Building2 } from 'lucide-react';
import SpotlightCard from '../../../../styles/spotlight/SpotlightCard';
import type { Project, PurchaseOrder, Quote, Site } from '../types';
// Import the tab components
import { 
  QuotesTab, 
  PurchaseOrdersTab,
  SitesTab,
  RamsTab,
  CppTab,
  ContractsTab,
  SiteSurveyTab,
  FilesTab,
  AdditionalWorkTab,
  TodoTab
} from '../../Tabs';
import { GanttChartTab } from '../../Tabs/GanttChart/GanttChartTab';
import { SignOffTab } from '../../Tabs/SignOff/SignOffTab';

interface ProjectDetailProps {
  selectedProject: Project;
  activeTab: 'quotes' | 'orders' | 'gantt' | 'sites' | 'rams' | 'cpp' | 'contracts' | 'site_survey' | 'files' | 'additional_work' | 'signoff' | 'todo';
  setActiveTab: (tab: 'quotes' | 'orders' | 'gantt' | 'sites' | 'rams' | 'cpp' | 'contracts' | 'site_survey' | 'files' | 'additional_work' | 'signoff' | 'todo') => void;
  projectOrders: PurchaseOrder[];
  projectQuotes: Quote[];
  projectSites: Site[];
  projectRams: any[];
  projectCpp: any[];
  projectContracts: any[];
  projectSiteSurveys: any[];
  projectFiles: any[];
  loadingOrders: boolean;
  loadingQuotes: boolean;
  loadingSites: boolean;
  loadingRams: boolean;
  loadingCpp: boolean;
  loadingContracts: boolean;
  loadingSiteSurveys: boolean;
  loadingFiles: boolean;
  onProjectClick: (project: Project) => void;
  onSetSelectedProject: (project: Project | null) => void;
  fetchSites: (projectId: string) => void;
  fetchRams: (projectId: string) => void;
  fetchCpp: (projectId: string) => void;
  fetchContracts: (projectId: string) => void;
  fetchSiteSurveys: (projectId: string) => void;
  fetchFiles: (projectId: string) => void;
}

export function ProjectDetail({
  selectedProject,
  activeTab,
  setActiveTab,
  projectOrders,
  projectQuotes,
  projectSites,
  projectRams,
  projectCpp,
  projectContracts,
  projectSiteSurveys,
  projectFiles,
  loadingOrders,
  loadingQuotes,
  loadingSites,
  loadingRams,
  loadingCpp,
  loadingContracts,
  loadingSiteSurveys,
  loadingFiles,
  onProjectClick,
  onSetSelectedProject,
  fetchSites,
  fetchRams,
  fetchCpp,
  fetchContracts,
  fetchSiteSurveys,
  fetchFiles,
}: ProjectDetailProps) {
  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#171E29]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
            <button
                onClick={() => onSetSelectedProject(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Project Management
            </button>
           
          </div>
                      
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {selectedProject.name}
            </h1>
          </div>
          
          {/* Widgets Section */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Widget 01 - Project Name */}
            <SpotlightCard
              isDarkMode={document.documentElement.classList.contains('dark')}
              spotlightColor="rgba(233, 213, 255, 0.4)"
              darkSpotlightColor="rgba(233, 213, 255, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <div className="z-10">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                    Project Name
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {selectedProject.name}
                  </p>
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#F3E8FF" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#a855f7' }} />
              </div>
            </SpotlightCard>

            {/* Widget 02 - Created */}
            <SpotlightCard
              isDarkMode={document.documentElement.classList.contains('dark')}
              spotlightColor="rgba(167, 243, 208, 0.4)"
              darkSpotlightColor="rgba(167, 243, 208, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <div className="z-10">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                    Created
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {new Date(selectedProject.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#F0FDF4" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#10b981' }} />
              </div>
            </SpotlightCard>

            {/* Widget 03 - Quotes */}
            <SpotlightCard
              isDarkMode={document.documentElement.classList.contains('dark')}
              spotlightColor="rgba(253, 230, 138, 0.4)"
              darkSpotlightColor="rgba(253, 230, 138, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <div className="z-10">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                    Quotes
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {projectQuotes.length}
                  </p>
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FEF3C7" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#f59e0b' }} />
              </div>
            </SpotlightCard>

            {/* Widget 04 - Purchase Orders */}
            <SpotlightCard
              isDarkMode={document.documentElement.classList.contains('dark')}
              spotlightColor="rgba(196, 181, 253, 0.4)"
              darkSpotlightColor="rgba(196, 181, 253, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <div className="z-10">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                    Purchase Orders
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {projectOrders.length}
                  </p>
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#EDE9FE" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <ShoppingCart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
            </SpotlightCard>

            {/* Widget 05 - Sites */}
            <SpotlightCard
              isDarkMode={document.documentElement.classList.contains('dark')}
              spotlightColor="rgba(254, 202, 202, 0.4)"
              darkSpotlightColor="rgba(254, 202, 202, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <div className="z-10">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                    Sites
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {projectSites.length}
                  </p>
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FEF2F2" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <Building2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#ef4444' }} />
              </div>
            </SpotlightCard>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <button
                onClick={() => setActiveTab('files')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'files'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                Files
              </button>
              <button
                onClick={() => setActiveTab('todo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'todo'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                To Do
              </button>
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'quotes'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                Quotes
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                Purchase Orders
              </button>
              <button
                onClick={() => setActiveTab('sites')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'sites'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                Sites
              </button>
              <button
                onClick={() => setActiveTab('rams')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'rams'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                RAMS
              </button>
              <button
                onClick={() => setActiveTab('cpp')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'cpp'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                CPP
              </button>
              <button
                onClick={() => setActiveTab('contracts')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'contracts'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                Contracts
              </button>
              <button
                onClick={() => setActiveTab('site_survey')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'site_survey'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                Site Survey
              </button>
              <button
                onClick={() => setActiveTab('gantt')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'gantt'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                Gantt Timeline
              </button>
              <button
                onClick={() => setActiveTab('additional_work')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'additional_work'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                Additional Work
              </button>
              <button
                onClick={() => setActiveTab('signoff')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'signoff'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 shadow-lg'
                }`}
              >
                Sign Off
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'files' ? (
          <FilesTab
            project={selectedProject}
            files={projectFiles}
            isLoading={loadingFiles}
            onFilesChange={() => {
              fetchFiles(selectedProject.id);
            }}
          />
        ) : activeTab === 'orders' ? (
          <PurchaseOrdersTab
            project={selectedProject}
            orders={projectOrders}
            onOrderChange={() => onProjectClick(selectedProject)}
            isLoading={loadingOrders}
          />
        ) : activeTab === 'quotes' ? (
          <QuotesTab 
            project={selectedProject}
            quotes={projectQuotes}
            onQuoteChange={() => onProjectClick(selectedProject)}
            isLoading={loadingQuotes}
          />
        ) : activeTab === 'contracts' ? (
          <ContractsTab
            project={selectedProject}
            contracts={projectContracts}
            isLoading={loadingContracts}
            onContractsChange={() => {
              fetchContracts(selectedProject.id);
            }}
          />
        ) : activeTab === 'sites' ? (
          <SitesTab
            project={selectedProject}
            sites={projectSites}
            isLoading={loadingSites}
            onSitesChange={() => {
              // Refresh the sites list
              fetchSites(selectedProject.id);
            }}
          />
        ) : activeTab === 'site_survey' ? (
          <SiteSurveyTab
            project={selectedProject}
            siteSurveys={projectSiteSurveys}
            isLoading={loadingSiteSurveys}
            onSiteSurveysChange={() => {
              // Refresh the site surveys list
              fetchSiteSurveys(selectedProject.id);
            }}
          />
        ) : activeTab === 'rams' ? (
          <RamsTab
            project={selectedProject}
            rams={projectRams}
            isLoading={loadingRams}
            onRamsChange={() => {
              fetchRams(selectedProject.id);
            }}
          />
        ) : activeTab === 'cpp' ? (
          <CppTab
            project={selectedProject}
            cpps={projectCpp}
            isLoading={loadingCpp}
            onCppChange={() => {
              fetchCpp(selectedProject.id);
            }}
          />
        ) : activeTab === 'additional_work' ? (
          <AdditionalWorkTab
            projectId={selectedProject.id}
            projectName={selectedProject.name}
          />
        ) : activeTab === 'signoff' ? (
          <SignOffTab
            project={selectedProject}
          />
        ) : activeTab === 'todo' ? (
          <TodoTab
            projectId={selectedProject.id}
          />
        ) : (
          <GanttChartTab
            project={selectedProject}
            onBack={() => setActiveTab('orders')}
          />
        )}
      </div>
    </div>
  );
}
