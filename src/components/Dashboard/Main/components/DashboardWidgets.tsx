import React from 'react';
import { 
  Building, 
  Users, 
  ShoppingCart, 
  FileText, 
  BookOpen, 
  BarChart3, 
  HardHat 
} from 'lucide-react';
import SpotlightCard from '../../../../styles/spotlight/SpotlightCard';
import type { ModulesConfig } from '../types/dashboardTypes';

interface DashboardWidgetsProps {
  isDarkMode: boolean;
  modules: ModulesConfig;
  resetView: () => void;
  
  // Admin functions
  setShowCalendar: (show: boolean) => void;
  setShowStaff: (show: boolean) => void;
  setShowSubcontractors: (show: boolean) => void;
  setShowTasks: (show: boolean) => void;
  setShowToDo: (show: boolean) => void;
  setShowFiles: (show: boolean) => void;
  setShowHolidays: (show: boolean) => void;
  
  // Customers & Projects functions
  setShowContractsManagement: (show: boolean) => void;
  setShowCustomersList: (show: boolean) => void;
  setShowProjectsList: (show: boolean) => void;
  setShowSiteSurvey: (show: boolean) => void;
  setShowSitesList: (show: boolean) => void;
  setShowWorkers: (show: boolean) => void;
  
  // Purchase Orders functions
  setShowSuppliersList: (show: boolean) => void;
  setShowPurchaseOrdersList: (show: boolean) => void;
  
  // Quotes functions
  setShowQuotesList: (show: boolean) => void;
  setShowLeadManagement: (show: boolean) => void;
  setShowQuoteTerms: (show: boolean) => void;
  setShowPaymentInfo: (show: boolean) => void;
  
  // Training functions
  setShowTrainingMatrix: (show: boolean) => void;
  setShowTrainingDashboard: (show: boolean) => void;
  setShowDSE: (show: boolean) => void;

  
  // Reporting functions
  setShowReportingDashboard: (show: boolean) => void;
  setShowAccidents: (show: boolean) => void;
  setShowActionPlan: (show: boolean) => void;
  
  // Health & Safety functions
  setShowHealthSafety: (show: boolean) => void;
  setShowDSE: (show: boolean) => void;
  setActiveSection: (section: string) => void;
  setShowCDM: (show: boolean) => void;
  setShowCPP: (show: boolean) => void;
  setShowCOSHH: (show: boolean) => void;
  setShowEquipment: (show: boolean) => void;
  setShowFire: (show: boolean) => void;
  setShowFirstAid: (show: boolean) => void;
  setShowGuidance: (show: boolean) => void;
  setShowOrganisationChart: (show: boolean) => void;
  setShowPolicies: (show: boolean) => void;
  setShowRAMSsubpage: (show: boolean) => void;
  setShowRiskAssessmentsubpage: (show: boolean) => void;
  setShowToolboxTalks: (show: boolean) => void;
  setShowVehicles: (show: boolean) => void;
}

export function DashboardWidgets({
  isDarkMode,
  modules,
  resetView,
  setShowCalendar,
  setShowStaff,
  setShowSubcontractors,
  setShowTasks,
  setShowToDo,
  setShowFiles,
  setShowHolidays,
  setShowContractsManagement,
  setShowCustomersList,
  setShowProjectsList,
  setShowSiteSurvey,
  setShowSitesList,
  setShowWorkers,
  setShowSuppliersList,
  setShowPurchaseOrdersList,
  setShowQuotesList,
  setShowLeadManagement,
  setShowQuoteTerms,
  setShowPaymentInfo,
  setShowTrainingMatrix,  
  setShowTrainingDashboard,
  setShowReportingDashboard,
  setShowHealthSafety,
  setShowDSE,
  setShowAccidents,
  setShowActionPlan,
  setActiveSection,
  setShowCDM,
  setShowCPP,
  setShowCOSHH,
  setShowEquipment,
  setShowFire,
  setShowFirstAid,
  setShowGuidance,
  setShowOrganisationChart,
  setShowPolicies,
  setShowRAMSsubpage,
  setShowRiskAssessmentsubpage,
  setShowToolboxTalks,
  setShowVehicles,
}: DashboardWidgetsProps) {
  
  // Function to get dynamic widget number based on visible modules
  const getWidgetNumber = (moduleName: string): string => {
    const moduleOrder = ['admin', 'customersAndProjects', 'purchaseOrders', 'quotes', 'training', 'reporting', 'healthAndSafety'];
    const visibleModules = moduleOrder.filter(module => modules[module as keyof ModulesConfig]);
    const index = visibleModules.indexOf(moduleName);
    return index >= 0 ? String(index + 1).padStart(2, '0') : '01';
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {/* Admin Card */}
      {modules.admin && (
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(165, 243, 252, 0.4)"
          darkSpotlightColor="rgba(165, 243, 252, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400">
                {getWidgetNumber('admin')}
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                Company
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-base">
              <button onClick={() => { resetView(); setShowCalendar(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Calendar</button>
              <button onClick={() => { resetView(); setShowStaff(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Staff</button>
              <button onClick={() => { resetView(); setShowSubcontractors(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Sub Contractors</button>
              <button onClick={() => { resetView(); setShowTasks(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Company Tasks</button>
              <button onClick={() => { resetView(); setShowToDo(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">My To Do</button>
              <button onClick={() => { resetView(); setShowFiles(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Files</button>
              <button onClick={() => { resetView(); setShowHolidays(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Holidays</button>
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <Building className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: 'rgb(165 167 252)' }} />
          </div>
        </SpotlightCard>
      )}

      {/* Customers & Projects Card */}
      {modules.customersAndProjects && (
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(254, 202, 202, 0.4)"
          darkSpotlightColor="rgba(254, 202, 202, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400">
                {getWidgetNumber('customersAndProjects')}
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                Projects
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-base">
              <button onClick={() => { resetView(); setShowContractsManagement(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Contracts</button>
              <button onClick={() => { resetView(); setShowCustomersList(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Customers</button>
              <button onClick={() => { resetView(); setShowProjectsList(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Projects</button>
              <button onClick={() => { resetView(); setShowSiteSurvey(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Site Survey</button>
              <button onClick={() => { resetView(); setShowSitesList(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Sites</button>
              <button onClick={() => { resetView(); setShowWorkers(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Workers</button>
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fff7f6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <Users className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#F9A8D4' }} />
          </div>
        </SpotlightCard>
      )}

      {/* Purchase Orders Card */}
      {modules.purchaseOrders && (
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(196, 181, 253, 0.4)"
          darkSpotlightColor="rgba(196, 181, 253, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400">
                {getWidgetNumber('purchaseOrders')}
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                Purchase Orders
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-base">
              <button onClick={() => { resetView(); setShowSuppliersList(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Suppliers</button>
              <button onClick={() => { resetView(); setShowPurchaseOrdersList(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Purchase Orders</button>
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#f6f8ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <ShoppingCart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#6b8bff' }} />
          </div>
        </SpotlightCard>
      )}

      {/* Quotes Card */}
      {modules.quotes && (
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(167, 243, 208, 0.4)"
          darkSpotlightColor="rgba(167, 243, 208, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400">
                {getWidgetNumber('quotes')}
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                Quotes & Leads
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-base">
              <button onClick={() => { resetView(); setShowQuotesList(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Quotes</button>
              <button onClick={() => { resetView(); setShowLeadManagement(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Lead Management</button>
              <button onClick={() => { resetView(); setShowQuoteTerms(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Quote Terms</button>
              <button onClick={() => { resetView(); setShowPaymentInfo(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Payment Terms</button>
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#f6fff6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#6bff90' }} />
          </div>
        </SpotlightCard>
      )}

      {/* Training Card */}
      {modules.training && (
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(253, 224, 71, 0.4)"
          darkSpotlightColor="rgba(253, 224, 71, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400">
                {getWidgetNumber('training')}
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                Training
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-base">
              <button onClick={() => { resetView(); setShowDSE(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">DSE Assessment</button>
              <button onClick={() => { resetView(); setShowTrainingMatrix(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Training Records</button>
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fffef6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#fbbf24' }} />
          </div>
        </SpotlightCard>
      )}

      {/* Reporting Card */}
      {modules.reporting && (
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(251, 146, 60, 0.4)"
          darkSpotlightColor="rgba(251, 146, 60, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400">
                {getWidgetNumber('reporting')}
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                Reporting
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-base">
              <button onClick={() => { resetView(); setShowAccidents(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Accidents</button>
              <button onClick={() => { resetView(); setShowActionPlan(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Action Plan</button>
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fff7ed" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <BarChart3 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#fb923c' }} />
          </div>
        </SpotlightCard>
      )}

      {/* Health & Safety Card */}
      {modules.healthAndSafety && (
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(248, 113, 113, 0.4)"
          darkSpotlightColor="rgba(248, 113, 113, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative md:col-span-2"
        >
          <div className="z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400">
                {getWidgetNumber('healthAndSafety')}
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                Health & Safety
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 text-base">
              <button onClick={() => { resetView(); setActiveSection('health'); setShowHealthSafety(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Safety Dashboard</button>
              <button onClick={() => { resetView(); setShowCDM(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">CDM</button>
              <button onClick={() => { resetView(); setShowCPP(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">CPP</button>
              <button onClick={() => { resetView(); setShowCOSHH(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">COSHH</button>
              <button onClick={() => { resetView(); setShowEquipment(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Equipment</button>
              <button onClick={() => { resetView(); setShowFire(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Fire</button>
              <button onClick={() => { resetView(); setShowFirstAid(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">First Aid</button>
              <button onClick={() => { resetView(); setShowGuidance(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Guidance</button>
              <button onClick={() => { resetView(); setShowOrganisationChart(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Organisation Chart</button>
              <button onClick={() => { resetView(); setShowPolicies(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Policies</button>
              <button onClick={() => { resetView(); setShowRAMSsubpage(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">RAMS</button>
              <button onClick={() => { resetView(); setShowRiskAssessmentsubpage(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Risk Assessments</button>
              <button onClick={() => { resetView(); setShowToolboxTalks(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Toolbox Talks</button>
              <button onClick={() => { resetView(); setShowVehicles(true); }} className="text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300">Vehicles</button>
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#fef2f2" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <HardHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#f87171' }} />
          </div>
        </SpotlightCard>
      )}
    </div>
  );
}