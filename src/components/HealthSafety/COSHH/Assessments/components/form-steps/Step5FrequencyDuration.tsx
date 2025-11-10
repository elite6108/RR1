import React from 'react';
import { CoshhAssessment } from '../../types';

interface Step5FrequencyDurationProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
}

export const Step5FrequencyDuration: React.FC<Step5FrequencyDurationProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Frequency & Duration of Exposure
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount Used <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            value={formData.amount_used}
            onChange={(e) => setFormData({...formData, amount_used: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Amount</option>
            <option value="Small (ml)">Small (ml)</option>
            <option value="Medium (litres)">Medium (litres)</option>
            <option value="Large (cubic metres)">Large (cubic metres)</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Typical quantity used in a single application
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            How many times per day <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            value={formData.times_per_day}
            onChange={(e) => setFormData({...formData, times_per_day: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Frequency</option>
            <option value="1-5">1-5</option>
            <option value="5-10">5-10</option>
            <option value="More than 10">More than 10</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Number of times the substance is used daily
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Duration</option>
            <option value="1-5 Minutes">1-5 Minutes</option>
            <option value="6-30 minutes">6-30 minutes</option>
            <option value="31-60 minutes">31-60 minutes</option>
            <option value="1 hour+">1 hour+</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            How long each use session lasts
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            How often is the process done <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.how_often_process}
            onChange={(e) => setFormData({...formData, how_often_process: e.target.value})}
            placeholder="e.g., 3 times per week, daily, monthly"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Overall frequency of the process or task
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          How long does it take <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          type="text"
          value={formData.how_long_process}
          onChange={(e) => setFormData({...formData, how_long_process: e.target.value})}
          placeholder="e.g., 30 minutes, 2 hours, 1 week"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Total time required to complete the entire process
        </p>
      </div>

      

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 5 of 13:</strong> Document how often and for how long workers are exposed to the substance. 
          This information helps determine the level of risk and appropriate control measures.
        </p>
      </div>
    </div>
  );
};
