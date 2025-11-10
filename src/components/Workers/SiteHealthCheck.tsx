import React, { useState } from 'react';

interface SiteHealthCheckProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onComplete: () => void;
}

export function SiteHealthCheck({
  isOpen,
  onClose,
  userEmail,
  onComplete,
}: SiteHealthCheckProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fitToWork: '',
    takingMedications: '',
    wearingCorrectPPE: '',
    confirmed: false,
  });

  if (!isOpen) return null;

  const handleYesNoChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate step 1 before proceeding
      if (
        !formData.fitToWork ||
        !formData.takingMedications ||
        !formData.wearingCorrectPPE
      ) {
        setError('Please answer all questions before proceeding.');
        return;
      }

      // Check if any answers prevent proceeding
      if (
        formData.fitToWork === 'no' ||
        formData.takingMedications === 'yes' ||
        formData.wearingCorrectPPE === 'no'
      ) {
        setError(
          'Based on your responses, you may not be fit to work. Please contact your supervisor.'
        );
        return;
      }

      setError(null);
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    setError(null);
    setCurrentStep(1);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, confirmed: e.target.checked }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Validate step 2
    if (!formData.confirmed) {
      setError('Please confirm the declaration to proceed.');
      setLoading(false);
      return;
    }

    try {
      // For site check-in, we don't need to save to the database
      // Just call the onComplete callback
      if (userEmail) {
        console.log(`Health check completed for user: ${userEmail}`);
      }
      onComplete();
      onClose();
    } catch (err) {
      console.error('Error in health check:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  Daily Pre-Site Health Check
                </h3>

                {error && (
                  <div className="mt-2 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 dark:text-red-200">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  {currentStep === 1 && (
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Are you fit to work today?
                          </label>
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              onClick={() => handleYesNoChange('fitToWork', 'yes')}
                              className={`px-4 py-2 text-sm font-medium rounded-md ${
                                formData.fitToWork === 'yes'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => handleYesNoChange('fitToWork', 'no')}
                              className={`px-4 py-2 text-sm font-medium rounded-md ${
                                formData.fitToWork === 'no'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Are you taking any medications that could affect your ability to work safely?
                          </label>
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              onClick={() => handleYesNoChange('takingMedications', 'yes')}
                              className={`px-4 py-2 text-sm font-medium rounded-md ${
                                formData.takingMedications === 'yes'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => handleYesNoChange('takingMedications', 'no')}
                              className={`px-4 py-2 text-sm font-medium rounded-md ${
                                formData.takingMedications === 'no'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Are you wearing the correct PPE for the tasks you will be performing?
                          </label>
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              onClick={() => handleYesNoChange('wearingCorrectPPE', 'yes')}
                              className={`px-4 py-2 text-sm font-medium rounded-md ${
                                formData.wearingCorrectPPE === 'yes'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => handleYesNoChange('wearingCorrectPPE', 'no')}
                              className={`px-4 py-2 text-sm font-medium rounded-md ${
                                formData.wearingCorrectPPE === 'no'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Declaration
                          </label>
                          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300">
                            <p>
                              I confirm that the information provided is accurate and I am fit to work today. I understand that providing false information may result in disciplinary action.
                            </p>
                          </div>
                          <div className="mt-2">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.confirmed}
                                onChange={handleConfirmChange}
                                className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                I confirm the above declaration
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between">
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100"
              >
                Back
              </button>
            )}

            {currentStep === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-opacity-20 border-t-white rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
