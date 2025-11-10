import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Site, Project, NewSiteFormData } from '../../types';
import { UK_COUNTIES } from '../../constants';
import { StepIndicator } from '../StepIndicator';

interface EditSiteModalProps {
  isOpen: boolean;
  currentStep: number;
  site: Site | null;
  newSite: NewSiteFormData;
  projects: Project[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSiteChange: (site: Partial<NewSiteFormData>) => void;
  onPrevStep: () => void;
  onOpenW3WModal: () => void;
}

export function EditSiteModal({
  isOpen,
  currentStep,
  site,
  newSite,
  projects,
  onClose,
  onSubmit,
  onSiteChange,
  onPrevStep,
  onOpenW3WModal
}: EditSiteModalProps) {
  if (!isOpen || !site) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-hidden flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl p-6 max-w-md w-full m-4 max-h-[70vh] flex flex-col">
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
                    value={newSite.name}
                    onChange={(e) =>
                      onSiteChange({ name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project
                  </label>
                  <select
                    value={newSite.project_id}
                    onChange={(e) =>
                      onSiteChange({ project_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
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
                    value={newSite.address}
                    onChange={(e) =>
                      onSiteChange({ address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Town
                  </label>
                  <input
                    type="text"
                    value={newSite.town}
                    onChange={(e) =>
                      onSiteChange({ town: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    County
                  </label>
                  <select
                    value={newSite.county}
                    onChange={(e) =>
                      onSiteChange({ county: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    value={newSite.postcode}
                    onChange={(e) =>
                      onSiteChange({ postcode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    What3Words
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newSite.what3words}
                      onChange={(e) =>
                        onSiteChange({ what3words: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g. filled.count.soap"
                    />
                    <button
                      type="button"
                      onClick={onOpenW3WModal}
                      className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    >
                      Click to open W3W and copy the words and paste back into this box
                    </button>
                  </div>
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
                    value={newSite.site_manager}
                    onChange={(e) =>
                      onSiteChange({ site_manager: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newSite.phone}
                    onChange={(e) =>
                      onSiteChange({ phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-lg-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
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
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left h-4 w-4 mr-1 inline" style={{ marginTop: '-2px' }}><path d="m15 18-6-6 6-6"></path></svg>
                  Previous
                </button>
              )}
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {currentStep === 3 ? 'Update Site' : 'Next'}
                {currentStep !== 3 && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right h-4 w-4 ml-1 inline" style={{ marginTop: '-2px' }}><path d="m9 18 6-6-6-6"></path></svg>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
