import React from 'react';
import { CoshhAssessment } from '../../types';

interface Step7ControlMethodsProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
}

export const Step7ControlMethods: React.FC<Step7ControlMethodsProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Control Methods & Safety Measures
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          General Precautions <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.general_precautions}
          onChange={(e) => setFormData({...formData, general_precautions: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe general safety precautions and good practices..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include basic safety measures, training requirements, and general handling precautions
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          First Aid Measures <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.first_aid_measures}
          onChange={(e) => setFormData({...formData, first_aid_measures: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Detail first aid procedures for different exposure routes..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include procedures for skin contact, eye contact, inhalation, and ingestion
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Accidental Release Measures <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.accidental_release_measures}
          onChange={(e) => setFormData({...formData, accidental_release_measures: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe spill cleanup procedures and containment measures..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include cleanup methods, containment procedures, and disposal of contaminated materials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ventilation <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            value={formData.ventilation}
            onChange={(e) => setFormData({...formData, ventilation: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Describe ventilation requirements..."
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Local exhaust ventilation, general ventilation requirements
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Handling <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            value={formData.handling}
            onChange={(e) => setFormData({...formData, handling: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Describe safe handling procedures..."
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Safe handling practices and techniques
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Storage <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.storage}
          onChange={(e) => setFormData({...formData, storage: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe storage conditions and requirements..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Temperature, humidity, incompatible materials, container requirements
        </p>
      </div>

     
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 7 of 13:</strong> Document the control methods and safety measures in place. 
          Focus on higher-level controls (elimination, substitution, engineering) before relying on PPE.
        </p>
      </div>
    </div>
  );
};
