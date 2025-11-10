import React from 'react';
import { CoshhAssessment } from '../../types';

interface Step11AssessorSummaryProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
}

export const Step11AssessorSummary: React.FC<Step11AssessorSummaryProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Assessor Summary <span className="text-gray-400 text-xs">(optional)</span>
      </h3>
      
      {/* Question 1 */}
      <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <strong>Q1:</strong> Has the assessment taken into account all relevant factors relating to the use of the substance? 
          If not, please specify what further action is needed.
        </p>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setFormData({...formData, q1_answer: true})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              formData.q1_answer
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, q1_answer: false})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              !formData.q1_answer
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            No
          </button>
        </div>
        {!formData.q1_answer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Further Action Required <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              value={formData.q1_action}
              onChange={(e) => setFormData({...formData, q1_action: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Specify what further action is needed..."
            />
          </div>
        )}
      </div>

      {/* Question 2 */}
      <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <strong>Q2:</strong> Has the feasibility of preventing exposure been fully considered in the assessment? 
          If not, outline the additional steps that should be taken.
        </p>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setFormData({...formData, q2_answer: true})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              formData.q2_answer
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, q2_answer: false})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              !formData.q2_answer
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            No
          </button>
        </div>
        {!formData.q2_answer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Steps Required <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              value={formData.q2_action}
              onChange={(e) => setFormData({...formData, q2_action: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Outline additional steps for preventing exposure..."
            />
          </div>
        )}
      </div>

      {/* Question 3 */}
      <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <strong>Q3:</strong> Has the assessment addressed the measures necessary to achieve and maintain sufficient control of exposure 
          where complete prevention isn't reasonably practicable? If not, provide details of the further action required.
        </p>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setFormData({...formData, q3_answer: true})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              formData.q3_answer
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, q3_answer: false})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              !formData.q3_answer
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            No
          </button>
        </div>
        {!formData.q3_answer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Further Action Details <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              value={formData.q3_action}
              onChange={(e) => setFormData({...formData, q3_action: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Provide details of further action required for exposure control..."
            />
          </div>
        )}
      </div>

      {/* Question 4 */}
      <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <strong>Q4:</strong> Has the need for monitoring levels of exposure to the substance been evaluated as part of the assessment? 
          If not, explain what further action should be undertaken.
        </p>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setFormData({...formData, q4_answer: true})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              formData.q4_answer
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, q4_answer: false})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              !formData.q4_answer
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            No
          </button>
        </div>
        {!formData.q4_answer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monitoring Action Required <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              value={formData.q4_action}
              onChange={(e) => setFormData({...formData, q4_action: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Explain what monitoring actions should be undertaken..."
            />
          </div>
        )}
      </div>

      {/* Question 5 */}
      <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <strong>Q5:</strong> Has the assessment clearly identified all necessary steps to ensure compliance with applicable regulations? 
          If not, please describe any outstanding actions required.
        </p>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setFormData({...formData, q5_answer: true})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              formData.q5_answer
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, q5_answer: false})}
            className={`px-4 py-2 text-sm rounded-md border transition-colors ${
              !formData.q5_answer
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            No
          </button>
        </div>
        {!formData.q5_answer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Outstanding Actions <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              value={formData.q5_action}
              onChange={(e) => setFormData({...formData, q5_action: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe outstanding actions required for regulatory compliance..."
            />
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 11 of 13:</strong> The assessor summary provides a critical review of the assessment's completeness 
          and identifies any gaps or additional actions needed to ensure comprehensive risk management.
        </p>
      </div>
    </div>
  );
};
