import React from 'react';
import { X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEquipmentForm } from './hooks/useEquipmentForm';
import { StepIndicator } from './components/StepIndicator';
import { EquipmentDetailsStep } from './components/EquipmentDetailsStep';
import { PurchaseWarrantyStep } from './components/PurchaseWarrantyStep';
import { ServiceInspectionStep } from './components/ServiceInspectionStep';
import type { EquipmentFormProps } from './types';

export function EquipmentForm({ onClose, onSuccess, equipmentToEdit }: EquipmentFormProps) {
  const {
    currentStep,
    loading,
    error,
    formData,
    handleChange,
    handleSubmit,
    handleNextStep,
    handlePrevStep
  } = useEquipmentForm(equipmentToEdit);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EquipmentDetailsStep formData={formData} onChange={handleChange} />;
      case 2:
        return <PurchaseWarrantyStep formData={formData} onChange={handleChange} />;
      case 3:
        return <ServiceInspectionStep formData={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto my-8 sm:my-4 max-h-[90vh] sm:max-h-[800px] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 sm:p-8 border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold text-center sm:text-left">
              {equipmentToEdit ? 'Edit Equipment' : 'New Equipment'}
            </h2>
            <button
              onClick={onClose}
              className="w-full sm:w-auto text-gray-400 hover:text-gray-500 focus:outline-none flex justify-center items-center"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          <StepIndicator currentStep={currentStep} totalSteps={3} />

          <form className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-md">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {renderStep()}

            <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 pt-6 mt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-[#374151] dark:text-white dark:hover:bg-[#DC2626] rounded-md"
              >
                Cancel
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1 inline" />
                    Previous
                  </button>
                )}
                {currentStep === 3 ? (
                  <button
                    type="button"
                    onClick={() => handleSubmit(onSuccess, onClose)}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : equipmentToEdit ? 'Save Changes' : 'Create Equipment'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1 inline" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
