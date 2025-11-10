import React, { useState } from "react";
import { ChevronLeft, FileText, FileCheck, Info, Eye, Clipboard, UserCheck } from "lucide-react";
import SpotlightCard from "../../../../styles/spotlight/SpotlightCard";
import { HealthSafetyFileChecklist } from "./HealthSafetyFileChecklist";
import { CDMComplianceChecklist } from "./CDMComplianceChecklist";
import { ConstructionSiteInductionChecklist } from "./ConstructionSiteInductionChecklist";
import { ConstructionSiteInspectionChecklist } from "./ConstructionSiteInspectionChecklist";
import { ProejctInformationChecklist } from "./ProejctInformationChecklist";

interface CDMChecklistProps {
  onBack: () => void;
}

export const CDMChecklist = ({ onBack }: CDMChecklistProps) => {
  const [activeSection, setActiveSection] = useState("main");

  // Detect dark mode from document class
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="flex flex-col gap-4">
      {activeSection === "main" && (
        <>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">CDM Checklist</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* CDM Compliance Checklist Widget */}
            <SpotlightCard
              isDarkMode={isDarkMode}
              spotlightColor="rgba(233, 213, 255, 0.4)"
              darkSpotlightColor="rgba(233, 213, 255, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <button
                onClick={() => setActiveSection("cdmCompliance")}
                className="w-full h-full text-left"
              >
                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                      01
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                      CDM Compliance Checklist
                    </h3>
                  </div>
                </div>
                <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                      <path fill="#E9D5FF" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                    </svg>
                  </div>
                  <Clipboard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-300 dark:text-purple-400" />
                </div>
              </button>
            </SpotlightCard>

            {/* Construction Site Induction Checklist Widget */}
            <SpotlightCard
              isDarkMode={isDarkMode}
              spotlightColor="rgba(254, 202, 202, 0.4)"
              darkSpotlightColor="rgba(254, 202, 202, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <button
                onClick={() => setActiveSection("constructionSiteInduction")}
                className="w-full h-full text-left"
              >
                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                      02
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                      Construction Site Induction Checklist
                    </h3>
                  </div>
                </div>
                <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                      <path fill="#FED7D7" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                    </svg>
                  </div>
                  <FileCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-pink-300 dark:text-pink-400" />
                </div>
              </button>
            </SpotlightCard>

            {/* Construction Site Inspection Checklist Widget */}
            <SpotlightCard
              isDarkMode={isDarkMode}
              spotlightColor="rgba(187, 247, 208, 0.4)"
              darkSpotlightColor="rgba(187, 247, 208, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <button
                onClick={() => setActiveSection("constructionSiteInspection")}
                className="w-full h-full text-left"
              >
                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                      03
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                      Construction Site Inspection Checklist
                    </h3>
                  </div>
                </div>
                <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                      <path fill="#BBF7D0" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                    </svg>
                  </div>
                  <Eye className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-300 dark:text-green-400" />
                </div>
              </button>
            </SpotlightCard>

            {/* Health & Safety File Checklist Widget */}
            <SpotlightCard
              isDarkMode={isDarkMode}
              spotlightColor="rgba(255, 228, 181, 0.4)"
              darkSpotlightColor="rgba(255, 228, 181, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <button
                onClick={() => setActiveSection("healthSafetyFile")}
                className="w-full h-full text-left"
              >
                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                      04
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                      Health & Safety File Checklist
                    </h3>
                  </div>
                </div>
                <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                      <path fill="#FFE4B5" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                    </svg>
                  </div>
                  <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </button>
            </SpotlightCard>

            {/* Project Information Checklist Widget */}
            <SpotlightCard
              isDarkMode={isDarkMode}
              spotlightColor="rgba(147, 197, 253, 0.4)"
              darkSpotlightColor="rgba(147, 197, 253, 0.2)"
              size={400}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            >
              <button
                onClick={() => setActiveSection("projectInformation")}
                className="w-full h-full text-left"
              >
                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                      05
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                      Project Information Checklist
                    </h3>
                  </div>
                </div>
                <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                      <path fill="#93C5FD" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                    </svg>
                  </div>
                  <Info className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-300 dark:text-blue-400" />
                </div>
              </button>
            </SpotlightCard>
          </div>
        </>
      )}

      {activeSection === "cdmCompliance" && (
        <>
          <button
            onClick={() => setActiveSection("main")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Checklist
          </button>
          <CDMComplianceChecklist />
        </>
      )}

      {activeSection === "constructionSiteInduction" && (
        <>
          <button
            onClick={() => setActiveSection("main")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Checklist
          </button>
          <ConstructionSiteInductionChecklist />
        </>
      )}

      {activeSection === "constructionSiteInspection" && (
        <>
          <button
            onClick={() => setActiveSection("main")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Checklist
          </button>
          <ConstructionSiteInspectionChecklist />
        </>
      )}

      {activeSection === "healthSafetyFile" && (
        <>
          <button
            onClick={() => setActiveSection("main")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Checklist
          </button>
          <HealthSafetyFileChecklist />
        </>
      )}

      {activeSection === "projectInformation" && (
        <>
          <button
            onClick={() => setActiveSection("main")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Checklist
          </button>
          <ProejctInformationChecklist />
        </>
      )}
    </div>
  );
}; 