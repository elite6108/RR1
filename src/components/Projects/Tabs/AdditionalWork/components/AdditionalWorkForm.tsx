import React, { ChangeEvent } from 'react';
import { X } from 'lucide-react';
import { AdditionalWorkFormProps, VATType } from '../types';
import { CONSTANTS, cleanNumericInput } from '../utils';
import StepIndicator from './StepIndicator';

/**
 * Form component for adding/editing additional work
 */
const AdditionalWorkForm: React.FC<AdditionalWorkFormProps> = ({
  newWork,
  setNewWork,
  currentStep,
  projectName,
  onSubmit,
  onNext,
  onPrev,
  onCancel,
  isEditing
}) => {
  const handleInputChange = (field: keyof typeof newWork, value: string) => {
    setNewWork(prev => ({ ...prev, [field]: value }));
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = cleanNumericInput(e.target.value);
    handleInputChange('agreed_amount', cleanedValue);
  };

  const handleVATTypeChange = (vatType: VATType) => {
    handleInputChange('vat_type', vatType);
  };

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project
        </label>
        <input
          type="text"
          value={projectName}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={newWork.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={newWork.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
    </div>
  );

  const renderAmountsStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Agreed Amount
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
            £
          </span>
          <input
            type="text"
            value={newWork.agreed_amount}
            onChange={handleAmountChange}
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          VAT
        </label>
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
          {CONSTANTS.VAT_TYPES.map((vatType) => (
            <button
              key={vatType}
              type="button"
              onClick={() => handleVATTypeChange(vatType)}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                newWork.vat_type === vatType
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {vatType}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Agreed With
        </label>
        <input
          type="text"
          value={newWork.agreed_with}
          onChange={(e) => handleInputChange('agreed_with', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
    </div>
  );

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return renderDetailsStep();
      case 2:
        return renderAmountsStep();
      default:
        return null;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      onNext();
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isEditing ? 'Edit Additional Work' : 'Add Additional Work'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={CONSTANTS.TOTAL_STEPS}
            stepLabels={CONSTANTS.STEP_LABELS}
          />
          
          <form onSubmit={handleFormSubmit}>
            {renderFormStep()}
            
            <div className="flex justify-end space-x-3 mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={onPrev}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {currentStep === CONSTANTS.TOTAL_STEPS ? 'Save' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdditionalWorkForm;
