import React from 'react';
import { CoshhAssessment } from '../../types';

interface Step4ExposureLimitsProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
}

export const Step4ExposureLimits: React.FC<Step4ExposureLimitsProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Hazard Exposure Limits
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hazards & Precaution Statement <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.hazards_precautions}
          onChange={(e) => setFormData({...formData, hazards_precautions: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe the hazards and precautionary measures..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include H-statements and P-statements from the safety data sheet
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Occupational Exposure Standard (OES) <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.occupational_exposure}
          onChange={(e) => setFormData({...formData, occupational_exposure: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter occupational exposure standards..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Maximum concentration of a substance to which workers may be exposed
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Maximum Exposure Limits (MEL) <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.maximum_exposure}
          onChange={(e) => setFormData({...formData, maximum_exposure: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter maximum exposure limits..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Exposure limits that must not be exceeded
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Workplace Exposure Limits (WEL) TWA 8 Hours <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.workplace_exposure}
          onChange={(e) => setFormData({...formData, workplace_exposure: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter workplace exposure limits for 8-hour time-weighted average..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Average exposure over an 8-hour working day
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Short-Term Exposure Limit (STEL) 15 mins <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.stel}
          onChange={(e) => setFormData({...formData, stel: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter short-term exposure limits for 15-minute periods..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Maximum exposure allowed over a 15-minute period
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Stability and Reactivity <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.stability_reactivity}
          onChange={(e) => setFormData({...formData, stability_reactivity: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe stability conditions and reactive hazards..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Information about chemical stability and potential reactions
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ecological Information <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.ecological_information}
          onChange={(e) => setFormData({...formData, ecological_information: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe environmental impact and disposal considerations..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Environmental effects and ecotoxicity data
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 4 of 13:</strong> Document the exposure limits and hazard information. 
          This information is typically found in Section 8 and Section 10 of the Safety Data Sheet.
        </p>
      </div>
    </div>
  );
};
