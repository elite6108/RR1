import React from 'react';
import { CoshhAssessment } from '../../types';

interface Step10CommentsProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
}

export const Step10Comments: React.FC<Step10CommentsProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        COSHH Assessment Comments
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          COSHH Assessment Comments <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.assessment_comments}
          onChange={(e) => setFormData({...formData, assessment_comments: e.target.value})}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Provide any additional comments about this COSHH assessment..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Include any relevant observations, concerns, recommendations, or additional information not covered in previous sections
        </p>
      </div>

      {/* Comment Guidelines */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          💬 What to Include in Comments
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <strong>Assessment Observations:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Unique workplace conditions</li>
              <li>Special considerations</li>
              <li>Limitations of the assessment</li>
              <li>Areas needing further investigation</li>
            </ul>
          </div>
          <div>
            <strong>Recommendations:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Suggested improvements</li>
              <li>Alternative control measures</li>
              <li>Training recommendations</li>
              <li>Review schedule adjustments</li>
            </ul>
          </div>
        </div>
      </div>

                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 10 of 13:</strong> Provide any additional comments, observations, or recommendations 
          that will help others understand the assessment context and implement effective controls.
        </p>
      </div>
    </div>
  );
};
