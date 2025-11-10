import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Save, X } from 'lucide-react';
import { MainQuestionnaireProps } from './types';
import { useQuestionnaireForm } from './hooks/useQuestionnaireForm';
import { 
  submitHealthQuestionnaire, 
  updateWorkerRecord, 
  recordHealthCheck 
} from './utils/supabaseHelpers';
import { MedicalDeclaration } from './components/MedicalDeclaration';
import { OccupationalHistory } from './components/OccupationalHistory';
import { Declaration } from './components/Declaration';

export function MainQuestionnaire({
  isOpen,
  onClose,
  userEmail,
  onSuccess,
  isEditMode = false,
}: MainQuestionnaireProps) {
  const {
    formData,
    currentStep,
    workerName,
    loading,
    success,
    error,
    isLoadingExistingData,
    setLoading,
    setSuccess,
    setError,
    handleChange,
    handleSignatureChange,
    validateStep,
    nextStep,
    previousStep
  } = useQuestionnaireForm(userEmail, isEditMode);

  if (!isOpen) return null;

  // Show loading state while fetching existing data
  if (isEditMode && isLoadingExistingData) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                <span className="ml-3 text-gray-900 dark:text-white">Loading existing questionnaire...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Submit the health questionnaire
      await submitHealthQuestionnaire(formData, userEmail!, user.id, isEditMode);

      // Update worker record with the health check date
      if (userEmail) {
        try {
          await updateWorkerRecord(userEmail);
          await recordHealthCheck(userEmail, formData);
        } catch (err) {
          console.error('DEBUG: Error in health questionnaire update:', err);
          console.error('DEBUG: Full error object:', JSON.stringify(err));
          setError(`Error updating worker record: ${err instanceof Error ? err.message : String(err)}`);
          // We'll continue but show the error to the user
        }
      }

      setSuccess(true);

      // Call onSuccess to update parent component IMMEDIATELY
      if (onSuccess) {
        console.log('DEBUG: Calling onSuccess to update parent component');
        onSuccess();
      }

      // Close the modal after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1000); // Shorter delay for better UX
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'medicalDeclaration':
        return (
          <MedicalDeclaration
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 'occupationalHistory':
        return (
          <OccupationalHistory
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 'declaration':
        return (
          <Declaration
            formData={formData}
            handleChange={handleChange}
            workerName={workerName}
            onSignatureChange={handleSignatureChange}
          />
        );
      default:
        return null;
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'medicalDeclaration': return '1';
      case 'occupationalHistory': return '2';
      case 'declaration': return '3';
      default: return '1';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3 shrink-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              {isEditMode ? 'Edit' : ''} 6-Month Health Questionnaire
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-full max-h-[500px] overflow-y-auto px-4 py-5 sm:p-6 pr-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentStep === 'medicalDeclaration' ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentStep === 'occupationalHistory' ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentStep === 'declaration' ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Step {getStepNumber()} of 3
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {renderCurrentStep()}

              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Questionnaire submitted successfully!
                  </p>
                </div>
              )}
            </form>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center shrink-0">
            <div>
              {currentStep !== 'medicalDeclaration' && (
                <button
                  type="button"
                  onClick={(e: any) => {
                    e.preventDefault();
                    previousStep();
                  }}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100"
                >
                  Previous
                </button>
              )}
            </div>

            <div>
              {currentStep !== 'declaration' ? (
                <button
                  type="button"
                  onClick={(e: any) => {
                    e.preventDefault();
                    nextStep();
                  }}
                  className="flex items-center bg-indigo-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center bg-indigo-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                  <Save className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
