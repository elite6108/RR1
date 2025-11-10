import React from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2 } from 'lucide-react';
import { Report, FormOptions, FormProps } from '../types';

// Import forms with default import
import SevenDayIncapacitationForm from './forms/reportaccident/7dayincapacitation/SevenDayIncapacitationForm';
import FatalityForm from './forms/reportaccident/fatality/FatalityForm';
import HospitalTreatmentForm from './forms/reportaccident/hospitaltreatment/HospitalTreatmentForm';
import IllHealthForm from './forms/reportaccident/illhealth/IllHealthForm';
import MinorAccidentForm from './forms/reportaccident/minoraccident/MinorAccidentForm';
import NonFatalForm from './forms/reportaccident/nonfatal/NonFatalForm';
import OccupationalDiseaseForm from './forms/reportaccident/occupationaldisease/OccupationalDiseaseForm';
import PersonalInjuryForm from './forms/reportaccident/personalinjury/PersonalInjuryForm';
import SpecifiedInjuriesForm from './forms/reportaccident/specifiedinjuries/SpecifiedInjuriesForm';

// Near miss forms
import DangerousOccurrenceForm from './forms/reportnearmiss/dangerousoccurrence/DangerousOccurrenceForm';
import NearMissForm from './forms/reportnearmiss/nearmiss/NearMissForm';

// Incident forms
import EnvironmentalForm from './forms/reportincident/environmental/EnvironmentalForm';
import PropertyDamageForm from './forms/reportincident/propertydamage/PropertyDamageForm';
import UnsafeActionsForm from './forms/reportincident/unsafeactions/UnsafeActionsForm';
import UnsafeConditionsForm from './forms/reportincident/unsafeconditions/UnsafeConditionsForm';
import UtilityDamageForm from './forms/reportincident/utilitydamage/UtilityDamageForm';

interface HSAccidentsReportsModalsProps {
  showAddModal: boolean;
  showFormModal: boolean;
  showDeleteModal: boolean;
  activeTab: string;
  selectedFormType: string;
  selectedReport: Report | null;
  selectedReportData: any;
  formOptions: FormOptions;
  onCloseAddModal: () => void;
  onCloseFormModal: () => void;
  onCloseDeleteModal: () => void;
  onSetActiveTab: (tab: string) => void;
  onFormSelect: (formType: string) => void;
  onDelete: () => void;
  fetchReports: () => void;
}

export function HSAccidentsReportsModals({
  showAddModal,
  showFormModal,
  showDeleteModal,
  activeTab,
  selectedFormType,
  selectedReport,
  selectedReportData,
  formOptions,
  onCloseAddModal,
  onCloseFormModal,
  onCloseDeleteModal,
  onSetActiveTab,
  onFormSelect,
  onDelete,
  fetchReports
}: HSAccidentsReportsModalsProps) {
  
  // Render the appropriate form component based on the selected form type
  const renderForm = () => {
    const handleFormClose = () => {
      onCloseFormModal();
      // Ensure we refresh the reports list
      fetchReports();
    };

    const formProps: FormProps = {
      onClose: handleFormClose,
      onSubmitSuccess: () => {
        // Add an additional callback specifically for submission success
        fetchReports();
        onCloseFormModal();
      },
      initialData: selectedReportData,
      isEditing: !!selectedReport
    };

    console.log('Form props:', formProps);

    switch (selectedFormType) {
      // Report accident forms
      case 'sevendayincapacitation':
        return <SevenDayIncapacitationForm {...formProps} />;
      case 'fatality':
        return <FatalityForm {...formProps} />;
      case 'hospitaltreatment':
        return <HospitalTreatmentForm {...formProps} />;
      case 'illhealth':
        return <IllHealthForm {...formProps} />;
      case 'minoraccident':
        return <MinorAccidentForm {...formProps} />;
      case 'nonfatal':
        return <NonFatalForm {...formProps} />;
      case 'occupationaldisease':
        return <OccupationalDiseaseForm {...formProps} />;
      case 'personalinjury':
        return <PersonalInjuryForm {...formProps} />;
      case 'specifiedinjuries':
        return <SpecifiedInjuriesForm {...formProps} />;
      
      // Near miss forms
      case 'dangerousoccurrence':
        return <DangerousOccurrenceForm {...formProps} />;
      case 'nearmiss':
        return <NearMissForm {...formProps} />;
      
      // Incident forms
      case 'environmental':
        return <EnvironmentalForm {...formProps} />;
      case 'propertydamage':
        return <PropertyDamageForm {...formProps} />;
      case 'unsafeactions':
        return <UnsafeActionsForm {...formProps} />;
      case 'unsafeconditions':
        return <UnsafeConditionsForm {...formProps} />;
      case 'utilitydamage':
        return <UtilityDamageForm {...formProps} />;
      
      default:
        console.error('Unknown form type:', selectedFormType);
        return <div className="text-center py-4 text-gray-500 dark:text-gray-400">Form not implemented yet (Type: {selectedFormType})</div>;
    }
  };

  return (
    <>
      {/* Add Report Modal */}
      {showAddModal && (
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Create New Report</h2>
                <button 
                  onClick={onCloseAddModal} 
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Tabs */}
                <div className="mb-6">
                  {/* Tab Navigation - Responsive */}
                  <div className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-gray-600">
                    <button
                      className={`px-3 py-2 text-sm sm:text-base font-medium whitespace-nowrap ${
                        activeTab === 'accident' 
                          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                      onClick={() => onSetActiveTab('accident')}
                    >
                      Report an Accident
                    </button>
                    <button
                      className={`px-3 py-2 text-sm sm:text-base font-medium whitespace-nowrap ${
                        activeTab === 'nearmiss' 
                          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                      onClick={() => onSetActiveTab('nearmiss')}
                    >
                      Report a Near Miss
                    </button>
                    <button
                      className={`px-3 py-2 text-sm sm:text-base font-medium whitespace-nowrap ${
                        activeTab === 'incident' 
                          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                      onClick={() => onSetActiveTab('incident')}
                    >
                      Report an Incident
                    </button>
                  </div>
                  
                  {/* Tab Content - Responsive Grid */}
                  <div className="mt-4 sm:mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {formOptions[activeTab as keyof typeof formOptions].map((option) => (
                        <button
                          key={option.id}
                          className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-left hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onClick={() => onFormSelect(option.formType)}
                        >
                          <span className="text-sm sm:text-base font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      )}

      {/* Form Modal */}
      {showFormModal && (
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedReport ? 'Edit Report' : 'Report Form'}
                </h2>
                <button 
                  onClick={onCloseFormModal} 
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-6 w-6"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {renderForm()}
              </div>
            </div>
          </div>,
          document.body
        )
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedReport && (
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <Trash2 className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                Delete Report
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete this report? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onCloseDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </>
  );
}
