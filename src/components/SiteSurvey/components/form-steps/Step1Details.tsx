import React from 'react';
import type { FormStepProps } from '../../types';
import { INPUT_CLASS_NAME, DISABLED_INPUT_CLASS_NAME } from '../../utils/constants';
import { What3WordsModal } from '../What3WordsModal';

export function Step1Details({ 
  formData, 
  customers = [], 
  projects = [], 
  showW3WModal = false,
  setShowW3WModal,
  handleCustomerChange, 
  handleInputChange,
  isProjectContext = false
}: FormStepProps) {
  if (!formData) return null;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Customer *
        </label>
        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={handleCustomerChange}
          required
          disabled={isProjectContext}
          className={isProjectContext ? DISABLED_INPUT_CLASS_NAME : INPUT_CLASS_NAME}
        >
          <option value="">Select a customer...</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.company_name || customer.customer_name}
            </option>
          ))}
        </select>
        {isProjectContext && formData.customer_id && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customer is preselected based on the project and cannot be changed.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Project *
        </label>
        <select
          name="project_id"
          value={formData.project_id}
          onChange={handleInputChange}
          required
          disabled={!formData.customer_id || isProjectContext}
          className={!formData.customer_id || isProjectContext ? DISABLED_INPUT_CLASS_NAME : INPUT_CLASS_NAME}
        >
          <option value="">Select a project...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {isProjectContext && formData.project_id && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Project is preselected and cannot be changed in this context.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Location - What3Words
        </label>
        <div className="relative">
          <input
            type="text"
            name="location_what3words"
            value={formData.location_what3words}
            onChange={handleInputChange}
            placeholder="Enter What3Words location"
            className={INPUT_CLASS_NAME}
          />
          <button
            type="button"
            onClick={() => setShowW3WModal?.(true)}
            className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
          >
            Click to open W3W and copy the words and paste back into this box
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Address *
        </label>
        <textarea
          name="full_address"
          value={formData.full_address}
          onChange={handleInputChange}
          required
          rows={3}
          placeholder="Enter full address"
          className={INPUT_CLASS_NAME}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Site Contact *
        </label>
        <input
          type="text"
          name="site_contact"
          value={formData.site_contact}
          onChange={handleInputChange}
          required
          placeholder="Enter site contact details"
          className={INPUT_CLASS_NAME}
        />
      </div>
      
      {/* What3Words Modal */}
      <What3WordsModal
        isOpen={showW3WModal}
        onClose={() => setShowW3WModal?.(false)}
      />
    </div>
  );
}