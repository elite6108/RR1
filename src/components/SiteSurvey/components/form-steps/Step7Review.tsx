import React from 'react';
import type { FormStepProps } from '../../types';

export function Step7Review({ 
  formData, 
  customers = [], 
  projects = []
}: FormStepProps) {
  if (!formData) return null;

  // Find customer and project names for display
  const customer = customers.find(c => c.id === formData.customer_id);
  const project = projects.find(p => p.id === formData.project_id);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Review your site survey</h3>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Step 1: Details</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Customer:</dt>
            <dd className="text-gray-900 dark:text-white">{customer ? (customer.company_name || customer.customer_name) : 'Not selected'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Project:</dt>
            <dd className="text-gray-900 dark:text-white">{project ? project.name : 'Not selected'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">What3Words Location:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.location_what3words || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Site Contact:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.site_contact || 'Not provided'}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Step 2: Site Access</h4>
        <dl className="grid grid-cols-1 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Description:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.site_access_description || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Suitable for 3.5m lorry:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.suitable_for_lorry ? 'Yes' : 'No'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Images:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.site_access_images.length} uploaded</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Videos:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.site_access_videos.length} uploaded</dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Step 3: Land</h4>
        <dl className="grid grid-cols-1 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Water handling:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.water_handling || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Manholes description:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.manholes_description || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Services present:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.services_present ? 'Yes' : 'No'}</dd>
          </div>
          {formData.services_present && (
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Services description:</dt>
              <dd className="text-gray-900 dark:text-white">{formData.services_description || 'Not provided'}</dd>
            </div>
          )}
          {formData.services_present && (
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Services images:</dt>
              <dd className="text-gray-900 dark:text-white">{formData.services_images.length} uploaded</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Step 4: Work Required</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Number of courts:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.number_of_courts}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Shuttering required:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.shuttering_required ? 'Yes' : 'No'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Tarmac required:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.tarmac_required ? 'Yes' : 'No'}</dd>
          </div>
          {formData.tarmac_required && (
            <>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Tarmac location:</dt>
                <dd className="text-gray-900 dark:text-white">{formData.tarmac_location || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Space for tarmac wagon:</dt>
                <dd className="text-gray-900 dark:text-white">{formData.tarmac_wagon_space ? 'Yes' : 'No'}</dd>
              </div>
            </>
          )}
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Muckaway required:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.muckaway_required ? 'Yes' : 'No'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Surface type:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.surface_type || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Lighting required:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.lighting_required ? 'Yes' : 'No'}</dd>
          </div>
          {formData.lighting_required && (
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Lighting description:</dt>
              <dd className="text-gray-900 dark:text-white">{formData.lighting_description || 'Not specified'}</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Canopies required:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.canopies_required ? 'Yes' : 'No'}</dd>
          </div>
          {formData.canopies_required && (
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Number of canopies:</dt>
              <dd className="text-gray-900 dark:text-white">{formData.number_of_canopies}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Step 5: Court Features</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Court dimensions:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.court_dimensions || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Court height:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.court_height} meters</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Court enclosure type:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.court_enclosure_type === 'option1' ? 'Option 1' : 'Option 2'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Court floor material:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.court_floor_material || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Court features:</dt>
            <dd className="text-gray-900 dark:text-white">
              {formData.court_features.length > 0 
                ? formData.court_features.join(', ') 
                : 'None selected'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Step 6: Drawings & Plans</h4>
        <dl className="grid grid-cols-1 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Images:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.drawings_images.length} uploaded</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Videos:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.drawings_videos.length} uploaded</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Notes/Comments:</dt>
            <dd className="text-gray-900 dark:text-white">{formData.notes_comments || 'None provided'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}