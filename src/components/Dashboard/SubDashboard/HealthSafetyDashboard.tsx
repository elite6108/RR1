import React from 'react';
import { 
  HardHat, 
  ClipboardCheck, 
  FileText,
  Calendar as CalendarIcon,
  ChevronLeft,
  AlertTriangle,
  FileCheck,
  Wrench
} from 'lucide-react';
import SpotlightCard from '../../../styles/spotlight/SpotlightCard';

interface HealthSafetyDashboardProps {
  onBack: () => void;
  setShowActionPlan: (show: boolean) => void;
  setShowRiskAssessmentsubpage: (show: boolean) => void;
  setShowDriversList: (show: boolean) => void;
  setShowVehicles: (show: boolean) => void;
  setShowVehicleChecklist: (show: boolean) => void;
  setShowEquipmentChecklist: (show: boolean) => void;
  setShowDSE: (show: boolean) => void;
  setShowPolicies: (show: boolean) => void;
  setShowRAMSsubpage: (show: boolean) => void;
  setShowCPP: (show: boolean) => void;
  setShowToolboxTalks: (show: boolean) => void;
  setShowSignage: (show: boolean) => void;
  setShowAccidents: (show: boolean) => void;
  setShowEquipment: (show: boolean) => void;
  setShowOrganisationChart: (show: boolean) => void;
  setShowTrainingMatrix: (show: boolean) => void;
  setShowCOSHH: (show: boolean) => void;
  setShowFire: (show: boolean) => void;
  setShowFirstAid: (show: boolean) => void;
  setShowGuidance: (show: boolean) => void;
  setShowCDM: (show: boolean) => void;
  setShowPPE: (show: boolean) => void;
  setShowSiteInspections: (show: boolean) => void;
  setShowWorkshop: (show: boolean) => void;
  overdueCounts: {
    riskAssessments: number;
    drivers: number;
    vehicles: number;
    vehicleChecklists: number;
    equipmentChecklists: number;
    dse: number;
    actionPlan30Days: number;
    actionPlan60Days: number;
    actionPlanOverdue: number;
  };
}

export function HealthSafetyDashboard({ 
  onBack, 
  setShowActionPlan,
  setShowRiskAssessmentsubpage,
  setShowDriversList,
  setShowVehicles,
  setShowVehicleChecklist,
  setShowEquipmentChecklist,
  setShowDSE,
  setShowPolicies,
  setShowRAMSsubpage,
  setShowCPP,
  setShowToolboxTalks,
  setShowSignage,
  setShowAccidents,
  setShowEquipment,
  setShowOrganisationChart,
  setShowTrainingMatrix,
  setShowCOSHH,
  setShowFire,
  setShowFirstAid,
  setShowGuidance,
  setShowCDM,
  setShowPPE,
  overdueCounts 
}: HealthSafetyDashboardProps) {
  console.log("HealthSafetyDashboard received overdueCounts.dse:", overdueCounts.dse);
  
  // Detect dark mode from document class
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <div>
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Health & Safety Section
      </h2>

      {/* Section 1: Overdue Count Widgets */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Overdue Items</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Risk Assessments Widget */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowRiskAssessmentsubpage(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Risk Assessment
                  </h3>
                  </div>
                <div className="text-lg font-medium text-red-600 dark:text-red-400 text-left">
                  {overdueCounts.riskAssessments}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <HardHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
            </button>
          </SpotlightCard>

          {/* Drivers Widget */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowVehicles(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Driver Licences
                  </h3>
                  </div>
                <div className="text-lg font-medium text-red-600 dark:text-red-400 text-left">
                  {overdueCounts.drivers}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <HardHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
            </button>
          </SpotlightCard>

          {/* Vehicles Widget */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowVehicles(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Vehicle Tests
                  </h3>
                  </div>
                <div className="text-lg font-medium text-red-600 dark:text-red-400 text-left">
                  {overdueCounts.vehicles}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <AlertTriangle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
            </button>
          </SpotlightCard>

          {/* Vehicle Checklists Widget */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowVehicles(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Vehicles
                  </h3>
                  </div>
                <div className="text-lg font-medium text-red-600 dark:text-red-400 text-left">
                  {overdueCounts.vehicleChecklists}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <ClipboardCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
            </button>
          </SpotlightCard>

          {/* Equipment Checklists Widget */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-whigreye dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowEquipment(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Equipment
                  </h3>
                  </div>
                <div className="text-lg font-medium text-red-600 dark:text-red-400 text-left">
                  {overdueCounts.equipmentChecklists}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <Wrench className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
            </button>
          </SpotlightCard>

          {/* DSE Widget */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-grey dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowDSE(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    DSE Assessment
                  </h3>
                </div>
                <div className="text-lg font-medium text-left">
                    {console.log("DSE widget rendering with value:", overdueCounts.dse)}
                    {overdueCounts.dse === 0 ? (
                    <span className="text-green-600 dark:text-green-400">DSE not due</span>
                    ) : overdueCounts.dse === -1 ? (
                    <span className="text-red-600 dark:text-red-400">DSE Due</span>
                    ) : (
                    <span className="text-red-600 dark:text-red-400">{overdueCounts.dse}</span>
                    )}
                  </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <FileCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
              </div>
            </button>
          </SpotlightCard>

          {/* Action Plan 30 Days Widget */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowActionPlan(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Actions (30 Days)
                  </h3>
                  </div>
                <div className="text-lg font-medium text-yellow-600 dark:text-yellow-400 text-left">
                  {overdueCounts.actionPlan30Days}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
            </button>
          </SpotlightCard>

          {/* Action Plan 60 Days Widget */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowActionPlan(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Actions (60 Days)
                  </h3>
                  </div>
                <div className="text-lg font-medium text-yellow-600 dark:text-yellow-400 text-left">
                  {overdueCounts.actionPlan60Days}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
            </button>
          </SpotlightCard>

          {/* Action Plan Overdue Widget */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowActionPlan(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Actions (Overdue)
                  </h3>
                  </div>
                <div className="text-lg font-medium text-red-600 dark:text-red-400 text-left">
                  {overdueCounts.actionPlanOverdue}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
            </button>
          </SpotlightCard>
        </div>
      </div>

      {/* Section 2: Health & Safety Management */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Health & Safety Management</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Action Plan Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
              <button
                onClick={() => setShowActionPlan(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                    01
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Action Plan
                  </h3>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <ClipboardCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
              </div>
              </button>
          </SpotlightCard>

          {/* COSHH Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
              <button
                onClick={() => setShowCOSHH(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                    02
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    COSHH
                  </h3>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <AlertTriangle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
              </div>
              </button>
          </SpotlightCard>

          {/* Equipment Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  03
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Equipment
                </h3>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setShowEquipment(true)}
                  className="block w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300"
                >
                  Equipment Management
                </button>
                <button
                  onClick={() => setShowPPE(true)}
                  className="block w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300"
                >
                  PPE Inspections
                </button>
                <button
                  onClick={() => setShowSiteInspections(true)}
                  className="block w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300"
                >
                  Site Inspections
                </button>
                <button
                  onClick={() => setShowWorkshop(true)}
                  className="block w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300"
                >
                  Workshop Inspections
                </button>
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <Wrench className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
          </SpotlightCard>

          {/* Fire & Lighting Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
              <button
                onClick={() => setShowFire(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                    04
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Fire & Lighting
                  </h3>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <AlertTriangle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
              </div>
              </button>
          </SpotlightCard>

          {/* First Aid Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
              <button
                onClick={() => setShowFirstAid(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                    05
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    First Aid
                  </h3>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <AlertTriangle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
              </div>
              </button>
          </SpotlightCard>

          {/* Guidance Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
              <button
                onClick={() => setShowGuidance(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                    06
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Guidance
                  </h3>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
              </div>
              </button>
          </SpotlightCard>

          {/* Organisation Chart Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
              <button
                onClick={() => setShowOrganisationChart(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                    07
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Organisation Chart
                  </h3>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <HardHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
              </div>
              </button>
          </SpotlightCard>

          {/* Policies Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  08
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Policies
                </h3>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setShowPolicies(true)}
                  className="block w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300"
                >
                  HS Policy
                </button>
                <button
                  onClick={() => setShowPolicies(true)}
                  className="block w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300"
                >
                  Other Policies
                </button>
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
          </SpotlightCard>

          {/* Risk Assessments Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <button
              onClick={() => setShowRiskAssessmentsubpage(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                    09
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Risk Assessments
                  </h3>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <HardHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
              </div>
            </button>
          </SpotlightCard>

          {/* Site Specific Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  10
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Site Specific
                </h3>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setShowRAMSsubpage(true)}
                  className="block w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300"
                >
                  RAMS
                </button>
                <button
                  onClick={() => setShowCDM(true)}
                  className="block w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300"
                >
                  CDM
                </button>
            
                <button
                  onClick={() => setShowToolboxTalks(true)}
                  className="block w-full text-left font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-b-2 border-transparent hover:border-indigo-400 transition-colors duration-300"
                >
                  Toolbox Talks
                </button>
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <HardHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
          </SpotlightCard>

          {/* Vehicles Card */}
          <SpotlightCard
            isDarkMode={isDarkMode}
            spotlightColor="rgba(255, 214, 92, 0.4)"
            darkSpotlightColor="rgba(255, 214, 92, 0.2)"
            size={400}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
          >
              <button
                onClick={() => setShowVehicles(true)}
              className="w-full h-full text-left"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                    11
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Vehicles
                  </h3>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <AlertTriangle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
              </div>
              </button>
          </SpotlightCard>
        </div>
      </div>
          </div>
  );
}
