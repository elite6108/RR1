import React from 'react';
import { CoshhAssessment } from '../../types';

interface Step9SpillageFireStorageProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
}

export const Step9SpillageFireStorage: React.FC<Step9SpillageFireStorageProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Spillage, Fire, Storage & Disposal
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Spillage Procedure <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.spillage_procedure}
          onChange={(e) => setFormData({...formData, spillage_procedure: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe step-by-step spillage cleanup procedures..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include containment, cleanup materials, disposal methods, and decontamination procedures
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fire & Explosion Prevention <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.fire_explosion}
          onChange={(e) => setFormData({...formData, fire_explosion: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe fire prevention measures and firefighting procedures..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include suitable extinguishing media, special firefighting procedures, and fire hazards
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Handling & Storage <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.handling_storage}
          onChange={(e) => setFormData({...formData, handling_storage: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe safe handling and storage requirements..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include storage conditions, incompatible materials, container specifications, and handling precautions
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Disposal Considerations <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.disposal_considerations}
          onChange={(e) => setFormData({...formData, disposal_considerations: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe proper disposal methods and waste management procedures..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include waste classification, disposal methods, and regulatory requirements
        </p>
      </div>

          

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 9 of 13:</strong> Document emergency procedures for spillage and fire incidents, 
          along with proper storage and disposal requirements. This information is typically found in 
          Sections 6, 5, 7, and 13 of the Safety Data Sheet.
        </p>
      </div>
    </div>
  );
};
