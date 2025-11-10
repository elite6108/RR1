import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CoshhAssessment, AssessmentModalState } from '../types';
import {
  Step1BasicInfo,
  Step2HazardsPPE,
  Step3ChemicalProperties,
  Step4ExposureLimits,
  Step5FrequencyDuration,
  Step6HazardSelection,
  Step7ControlMethods,
  Step8AdditionalControls,
  Step9SpillageFireStorage,
  Step10Comments,
  Step11AssessorSummary,
  Step12AssessmentConclusion,
  Step13FinalDetails
} from './form-steps';

interface IngredientItem {
  id: string;
  ingredient_name: string;
  wel_twa_8_hrs: string;
  stel_15_mins: string;
}

interface ControlItem {
  id: string;
  item: string;
}

interface AssessmentFormProps {
  modalState: AssessmentModalState;
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
  onCloseModals: () => void;
  onSubmit: (data: CoshhAssessment) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  ppeSearchQuery: string;
  setPpeSearchQuery: (query: string) => void;
  hazardSearchQuery: string;
  setHazardSearchQuery: (query: string) => void;
  iconUrls: Record<string, string>;
  hazardIconUrls: Record<string, string>;
  loadingIcons: boolean;
  loadingHazardIcons: boolean;
  ingredientItems: IngredientItem[];
  setIngredientItems: (items: IngredientItem[]) => void;
  controlItems: ControlItem[];
  setControlItems: (items: ControlItem[]) => void;
}

const TOTAL_STEPS = 13;

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  modalState,
  formData,
  setFormData,
  onCloseModals,
  onSubmit,
  currentStep,
  setCurrentStep,
  ppeSearchQuery,
  setPpeSearchQuery,
  hazardSearchQuery,
  setHazardSearchQuery,
  iconUrls,
  hazardIconUrls,
  loadingIcons,
  loadingHazardIcons,
  ingredientItems,
  setIngredientItems,
  controlItems,
  setControlItems
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!modalState.showAddModal && !modalState.showEditModal) return null;

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < TOTAL_STEPS) {
      nextStep();
    } else {
      // Final submission
      const submissionData = {
        ...formData,
        additional_control_items: controlItems.map(item => item.item),
        ingredient_items: ingredientItems.map(item => ({
          ingredient_name: item.ingredient_name,
          wel_twa_8_hrs: item.wel_twa_8_hrs,
          stel_15_mins: item.stel_15_mins
        }))
      };
      onSubmit(submissionData);
    }
  };

  const renderStepIndicator = () => {
    const getStepTitle = () => {
      const titles = [
        'Basic Information',
        'Hazards & PPE',
        'Chemical Properties',
        'Exposure Limits',
        'Frequency & Duration',
        'Hazard Selection',
        'Control Methods',
        'Additional Controls',
        'Spillage, Fire & Storage',
        'Assessment Comments',
        'Assessor Summary',
        'Assessment Conclusion',
        'Final Details'
      ];
      return titles[currentStep - 1] || 'Assessment Step';
    };
    
    return (
      <div className="mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-medium text-indigo-600">
            {getStepTitle()}
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {TOTAL_STEPS}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} setFormData={setFormData} />;
      case 2:
        return (
          <Step2HazardsPPE
            formData={formData}
            setFormData={setFormData}
            ppeSearchQuery={ppeSearchQuery}
            setPpeSearchQuery={setPpeSearchQuery}
            iconUrls={iconUrls}
            loadingIcons={loadingIcons}
          />
        );
      case 3:
        return (
          <Step3ChemicalProperties
            formData={formData}
            setFormData={setFormData}
            ingredientItems={ingredientItems}
            setIngredientItems={setIngredientItems}
          />
        );
      case 4:
        return <Step4ExposureLimits formData={formData} setFormData={setFormData} />;
      case 5:
        return <Step5FrequencyDuration formData={formData} setFormData={setFormData} />;
      case 6:
        return (
          <Step6HazardSelection
            formData={formData}
            setFormData={setFormData}
            hazardSearchQuery={hazardSearchQuery}
            setHazardSearchQuery={setHazardSearchQuery}
            hazardIconUrls={hazardIconUrls}
            loadingHazardIcons={loadingHazardIcons}
          />
        );
      case 7:
        return <Step7ControlMethods formData={formData} setFormData={setFormData} />;
      case 8:
        return (
          <Step8AdditionalControls
            formData={formData}
            setFormData={setFormData}
            controlItems={controlItems}
            setControlItems={setControlItems}
          />
        );
      case 9:
        return <Step9SpillageFireStorage formData={formData} setFormData={setFormData} />;
      case 10:
        return <Step10Comments formData={formData} setFormData={setFormData} />;
      case 11:
        return <Step11AssessorSummary formData={formData} setFormData={setFormData} />;
      case 12:
        return <Step12AssessmentConclusion formData={formData} setFormData={setFormData} />;
      case 13:
        return <Step13FinalDetails formData={formData} setFormData={setFormData} />;
      default:
        return <Step1BasicInfo formData={formData} setFormData={setFormData} />;
    }
  };



  const validateCurrentStep = () => {
    // Basic validation for required fields based on current step
    switch (currentStep) {
      case 1:
        return !!(formData.substance_name && formData.supplied_by && formData.assessment_date && 
                 formData.description_of_substance && formData.method_of_use && formData.site_and_location);
      case 13:
        return !!(formData.assessor_name && formData.assessment_date);
      default:
        return true; // Other steps are optional
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef} 
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-5xl w-full m-4 max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {modalState.showAddModal ? 'Add' : 'Edit'} COSHH Assessment
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
          </div>
          <button
            onClick={onCloseModals}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="min-h-[400px]">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onCloseModals}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={!validateCurrentStep()}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  validateCurrentStep()
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                    : 'text-gray-400 bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                }`}
              >
                {currentStep === TOTAL_STEPS 
                  ? (modalState.showEditModal ? 'Update Assessment' : 'Create Assessment')
                  : 'Next'
                }
                {currentStep < TOTAL_STEPS && <ChevronRight className="h-4 w-4 ml-1" />}
              </button>
            </div>
          </div>
        </form>

        {/* Progress Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Progress: {Math.round((currentStep / TOTAL_STEPS) * 100)}% complete</span>
            <span>
              {formData.substance_name ? `Assessment for: ${formData.substance_name}` : 'New Assessment'}
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
