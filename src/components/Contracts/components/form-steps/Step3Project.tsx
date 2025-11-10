import React from 'react';
import type { FormStepProps } from '../../types';

export function Step3Project({ 
  formData, 
  handleInputChange,
  projects = [],
  sites = [],
  siteAddress = '',
  siteManager = '',
  onProjectChange,
  onSiteChange,
  disableCustomerAndProject = false,
  preSelectedProjectId
}: FormStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Project *
        </label>
        <select
          name="project_id"
          value={formData.project_id}
          onChange={onProjectChange}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
            (disableCustomerAndProject || preSelectedProjectId) ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          disabled={disableCustomerAndProject || preSelectedProjectId !== undefined}
        >
          <option value="">Select a project...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project Manager *
        </label>
        <input
          type="text"
          name="project_manager"
          value={formData.project_manager}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Site *
        </label>
        <select
          name="site_id"
          value={formData.site_id}
          onChange={onSiteChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!formData.project_id}
        >
          <option value="">Select a site...</option>
          {sites
            .filter(
              (site) =>
                !formData.project_id || site.project_id === formData.project_id
            )
            .map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Site Address *
        </label>
        <input
          type="text"
          name="site_address"
          value={siteAddress}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Site Manager *
        </label>
        <input
          type="text"
          name="site_manager"
          value={siteManager}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project Start Date <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          type="date"
          name="project_start_date"
          value={formData.project_start_date}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Estimated End Date <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          type="date"
          name="estimated_end_date"
          value={formData.estimated_end_date}
          onChange={handleInputChange}
          min={formData.project_start_date}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}