import React, { useEffect } from 'react';
import type { SiteSurveyViewProps } from '../types';
import { formatDate } from '../utils/constants';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormFooter 
} from '../../../utils/form';

export function SiteSurveyView({ survey, customerName, projectName, onClose }: SiteSurveyViewProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader
        title="Site Survey Details"
        onClose={onClose}
      />

      <FormContent>
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">General Information</h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Survey ID:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.survey_id || survey.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Created At:</dt>
                <dd className="text-gray-900 dark:text-white">{formatDate(survey.created_at)}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Customer:</dt>
                <dd className="text-gray-900 dark:text-white">{customerName}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Project:</dt>
                <dd className="text-gray-900 dark:text-white">{projectName}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Location & Contact</h4>
            <dl className="grid grid-cols-1 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">What3Words Location:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.location_what3words || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Full Address:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.full_address || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Site Contact:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.site_contact || 'Not provided'}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Site Access</h4>
            <dl className="grid grid-cols-1 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Description:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.site_access_description || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Suitable for 3.5m lorry:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.suitable_for_lorry ? 'Yes' : 'No'}</dd>
              </div>
              {survey.site_access_images && survey.site_access_images.length > 0 && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Access Images:</dt>
                  <dd className="text-gray-900 dark:text-white mt-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {survey.site_access_images.map((img, index) => (
                        <a 
                          href={img} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          key={index}
                          className="block h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <img 
                            src={img} 
                            alt={`Site access ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
              {survey.site_access_videos && survey.site_access_videos.length > 0 && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Access Videos:</dt>
                  <dd className="text-gray-900 dark:text-white mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {survey.site_access_videos.map((video, index) => (
                        <div key={index} className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                          <video
                            src={video}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Land</h4>
            <dl className="grid grid-cols-1 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Water handling:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.water_handling || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Manholes description:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.manholes_description || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Is there any electrical, gas, utility services cables or pipes?</dt>
                <dd className="text-gray-900 dark:text-white">{survey.services_present ? 'Yes' : 'No'}</dd>
              </div>
              {survey.services_present && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Services description:</dt>
                  <dd className="text-gray-900 dark:text-white">{survey.services_description || 'Not provided'}</dd>
                </div>
              )}
              {survey.services_present && survey.services_images && survey.services_images.length > 0 && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Services Images:</dt>
                  <dd className="text-gray-900 dark:text-white mt-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {survey.services_images.map((img, index) => (
                        <a 
                          href={img} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          key={index}
                          className="block h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <img 
                            src={img} 
                            alt={`Service image ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Work Required</h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Number of courts:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.number_of_courts || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Shuttering required:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.shuttering_required ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Tarmac required:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.tarmac_required ? 'Yes' : 'No'}</dd>
              </div>
              {survey.tarmac_required && (
                <>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Tarmac location:</dt>
                    <dd className="text-gray-900 dark:text-white">{survey.tarmac_location || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Space for tarmac wagon:</dt>
                    <dd className="text-gray-900 dark:text-white">{survey.tarmac_wagon_space ? 'Yes' : 'No'}</dd>
                  </div>
                </>
              )}
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Muckaway required:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.muckaway_required ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Surface type:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.surface_type || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Lighting required:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.lighting_required ? 'Yes' : 'No'}</dd>
              </div>
              {survey.lighting_required && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Lighting description:</dt>
                  <dd className="text-gray-900 dark:text-white">{survey.lighting_description || 'Not specified'}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Canopies required:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.canopies_required ? 'Yes' : 'No'}</dd>
              </div>
              {survey.canopies_required && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Number of canopies:</dt>
                  <dd className="text-gray-900 dark:text-white">{survey.number_of_canopies}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Court Features</h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Court dimensions:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.court_dimensions || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Court height:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.court_height ? `${survey.court_height} meters` : 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Court enclosure type:</dt>
                <dd className="text-gray-900 dark:text-white">
                  {survey.court_enclosure_type === 'option1' ? 'Option 1' : 
                   survey.court_enclosure_type === 'option2' ? 'Option 2' : 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Court floor material:</dt>
                <dd className="text-gray-900 dark:text-white">{survey.court_floor_material || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Court features:</dt>
                <dd className="text-gray-900 dark:text-white">
                  {survey.court_features && survey.court_features.length > 0 
                    ? survey.court_features.join(', ') 
                    : 'None selected'}
                </dd>
              </div>
            </dl>
          </div>

          {(survey.drawings_images && survey.drawings_images.length > 0) || 
           (survey.drawings_videos && survey.drawings_videos.length > 0) ? (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Drawings & Plans</h4>
              <dl className="grid grid-cols-1 gap-y-4 text-sm">
                {survey.drawings_images && survey.drawings_images.length > 0 && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-2">Images:</dt>
                    <dd className="text-gray-900 dark:text-white">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {survey.drawings_images.map((img, index) => (
                          <a 
                            href={img} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            key={index}
                            className="block h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
                          >
                            <img 
                              src={img} 
                              alt={`Drawing ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
                
                {survey.drawings_videos && survey.drawings_videos.length > 0 && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-2">Videos:</dt>
                    <dd className="text-gray-900 dark:text-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {survey.drawings_videos.map((video, index) => (
                          <div key={index} className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <video
                              src={video}
                              controls
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          ) : null}

          {survey.notes_comments && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Notes/Comments</h4>
              <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {survey.notes_comments}
              </div>
            </div>
          )}
        </div>
      </FormContent>

      <FormFooter
        onCancel={onClose}
        cancelButtonText="Close"
      />
    </FormContainer>
  );
}