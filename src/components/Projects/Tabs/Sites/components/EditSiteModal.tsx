import React from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { UK_COUNTIES } from '../utils/constants';
import type { Site } from '../types';

interface EditSiteModalProps {
  isOpen: boolean;
  currentStep: number;
  siteToEdit: Site | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSiteChange: (site: Site) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export function EditSiteModal({
  isOpen,
  currentStep,
  siteToEdit,
  onClose,
  onSubmit,
  onSiteChange,
  onNextStep,
  onPrevStep,
}: EditSiteModalProps) {
  if (!isOpen || !siteToEdit) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full m-4 max-h-[70vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Edit Site
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <StepIndicator currentStep={currentStep} />

        <form
          onSubmit={onSubmit}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="space-y-4 overflow-y-auto overflow-x-hidden flex-1 pr-2">
            {currentStep === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={siteToEdit.name}
                    onChange={(e) =>
                      onSiteChange({ ...siteToEdit, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <input
                    type="text"
                    value={siteToEdit.address}
                    onChange={(e) =>
                      onSiteChange({ ...siteToEdit, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Town
                  </label>
                  <input
                    type="text"
                    value={siteToEdit.town}
                    onChange={(e) =>
                      onSiteChange({ ...siteToEdit, town: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    County
                  </label>
                  <select
                    value={siteToEdit.county}
                    onChange={(e) =>
                      onSiteChange({ ...siteToEdit, county: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select a county...</option>
                    {UK_COUNTIES.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={siteToEdit.postcode}
                    onChange={(e) =>
                      onSiteChange({ ...siteToEdit, postcode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    What3Words
                  </label>
                  <input
                    type="text"
                    value={siteToEdit.what3words || ''}
                    onChange={(e) =>
                      onSiteChange({ ...siteToEdit, what3words: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter What3Words address (e.g., filled.count.soap)"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Format: three words separated by dots (e.g.,
                    filled.count.soap)
                  </p>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site Manager
                  </label>
                  <input
                    type="text"
                    value={siteToEdit.site_manager}
                    onChange={(e) =>
                      onSiteChange({
                        ...siteToEdit,
                        site_manager: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={siteToEdit.phone}
                    onChange={(e) =>
                      onSiteChange({ ...siteToEdit, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 pt-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-red-600 dark:hover:text-white"
            >
              Cancel
            </button>
            <div className="flex flex-col sm:flex-row gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={onPrevStep}
                  className="w-full sm:w-auto inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
              )}
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {currentStep === 3 ? 'Update Site' : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
