import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { formatDate } from '../utils';

interface HealthQuestionnaireData {
  id: string;
  user_id: string;
  user_email: string;
  submission_date: string;
  questionnaire_type: '6-month' | 'daily';
  // Medical Declaration
  epilepsy: boolean;
  blackouts: boolean;
  diabetes: boolean;
  eyesight: boolean;
  color_blindness: boolean;
  hearing_impairment: boolean;
  physical_disability: boolean;
  arthritis: boolean;
  back_problems: boolean;
  hernia: boolean;
  hypertension: boolean;
  heart_disease: boolean;
  respiratory_disease: boolean;
  medical_details: string;
  prescribed_medications: string;
  // Occupational Health History
  hazardous_material_exposure: boolean;
  hazardous_material_details: string;
  work_related_health_problems: boolean;
  work_related_health_details: string;
  work_restrictions: boolean;
  work_restrictions_details: string;
  // Declaration
  full_name: string;
  digital_signature: string;
  confirmation_checked: boolean;
}

interface HealthQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerEmail: string;
  workerName: string;
}

export function HealthQuestionnaireModal({ 
  isOpen, 
  onClose, 
  workerEmail, 
  workerName 
}: HealthQuestionnaireModalProps) {
  const [questionnaire, setQuestionnaire] = useState<HealthQuestionnaireData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && workerEmail) {
      fetchLatestQuestionnaire();
    }
  }, [isOpen, workerEmail]);

  const fetchLatestQuestionnaire = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('health_questionnaires')
        .select('*')
        .eq('user_email', workerEmail)
        .eq('questionnaire_type', '6-month')
        .order('submission_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching questionnaire:', error);
        setError('Failed to load health questionnaire');
        return;
      }

      setQuestionnaire(data);
    } catch (err) {
      console.error('Error fetching questionnaire:', err);
      setError('Failed to load health questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const medicalConditions = [
    { key: 'epilepsy', label: 'Epilepsy' },
    { key: 'blackouts', label: 'Blackouts' },
    { key: 'diabetes', label: 'Diabetes' },
    { key: 'eyesight', label: 'Eyesight Problems' },
    { key: 'color_blindness', label: 'Color Blindness' },
    { key: 'hearing_impairment', label: 'Hearing Impairment' },
    { key: 'physical_disability', label: 'Physical Disability' },
    { key: 'arthritis', label: 'Arthritis' },
    { key: 'back_problems', label: 'Back Problems' },
    { key: 'hernia', label: 'Hernia' },
    { key: 'hypertension', label: 'Hypertension' },
    { key: 'heart_disease', label: 'Heart Disease' },
    { key: 'respiratory_disease', label: 'Respiratory Disease' },
  ];

  const occupationalHealthItems = [
    { key: 'hazardous_material_exposure', label: 'Hazardous Material Exposure', detailsKey: 'hazardous_material_details' },
    { key: 'work_related_health_problems', label: 'Work-Related Health Problems', detailsKey: 'work_related_health_details' },
    { key: 'work_restrictions', label: 'Work Restrictions', detailsKey: 'work_restrictions_details' },
  ];

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Health Questionnaire - {workerName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading questionnaire...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-600">
              <X className="h-8 w-8 mr-2" />
              <span>{error}</span>
            </div>
          ) : !questionnaire ? (
            <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <X className="h-8 w-8 mr-2" />
              <span>No health questionnaire found for this worker</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Submission Info */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Submission Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Submitted:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {formatDate(questionnaire.submission_date)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">
                      {questionnaire.questionnaire_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical Declaration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Medical Declaration
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {medicalConditions.map(({ key, label }) => (
                    <div key={key} className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                        {label}:
                      </span>
                      <span className={`text-sm font-medium ${
                        questionnaire[key as keyof HealthQuestionnaireData] 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {questionnaire[key as keyof HealthQuestionnaireData] ? 'Yes' : 'No'}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Check if any medical conditions are ticked */}
                {(medicalConditions.some(({ key }) => questionnaire[key as keyof HealthQuestionnaireData]) || questionnaire.medical_details) && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      If you've ticked any of the above, please provide details:
                    </span>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      {questionnaire.medical_details || 'No details provided'}
                    </p>
                  </div>
                )}
                
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Are you currently taking any prescribed medications?
                  </span>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    {questionnaire.prescribed_medications || 'No medications listed'}
                  </p>
                </div>
              </div>

              {/* Occupational Health History */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Occupational Health History
                </h3>
                <div className="space-y-4">
                  {occupationalHealthItems.map(({ key, label, detailsKey }) => (
                    <div key={key}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                          {label}:
                        </span>
                        <span className={`text-sm font-medium ${
                          questionnaire[key as keyof HealthQuestionnaireData] 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {questionnaire[key as keyof HealthQuestionnaireData] ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {questionnaire[key as keyof HealthQuestionnaireData] && 
                       questionnaire[detailsKey as keyof HealthQuestionnaireData] && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded ml-4">
                          {questionnaire[detailsKey as keyof HealthQuestionnaireData] as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Declaration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Declaration
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Signed by:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {questionnaire.full_name}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Confirmation:</span>
                    <span className={`ml-2 font-medium ${
                      questionnaire.confirmation_checked ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {questionnaire.confirmation_checked ? 'Confirmed' : 'Not Confirmed'}
                    </span>
                  </div>
                  {questionnaire.digital_signature && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Digital Signature:</span>
                      <div className="mt-2 border border-gray-200 dark:border-gray-600 rounded p-2">
                        <img 
                          src={questionnaire.digital_signature} 
                          alt="Digital Signature" 
                          className="max-h-20 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
