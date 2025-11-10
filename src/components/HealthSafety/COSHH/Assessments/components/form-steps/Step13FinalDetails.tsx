import React from 'react';
import { CoshhAssessment } from '../../types';

interface Step13FinalDetailsProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
}

export const Step13FinalDetails: React.FC<Step13FinalDetailsProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Final Details & Sign-off
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Taking into account the control measures in place, it is considered that the hazard from the substance is: 
          <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFormData({...formData, hazard_level: 'Low'})}
            className={`px-6 py-3 text-sm rounded-lg border-2 transition-colors ${
              formData.hazard_level === 'Low'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Low Risk</span>
            </div>
            <div className="text-xs mt-1 opacity-75">
              Minimal risk with current controls
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData({...formData, hazard_level: 'Medium'})}
            className={`px-6 py-3 text-sm rounded-lg border-2 transition-colors ${
              formData.hazard_level === 'Medium'
                ? 'bg-yellow-600 text-white border-yellow-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">Medium Risk</span>
            </div>
            <div className="text-xs mt-1 opacity-75">
              Moderate risk requiring attention
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData({...formData, hazard_level: 'High'})}
            className={`px-6 py-3 text-sm rounded-lg border-2 transition-colors ${
              formData.hazard_level === 'High'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium">High Risk</span>
            </div>
            <div className="text-xs mt-1 opacity-75">
              Significant risk needing immediate action
            </div>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assessor Name *
          </label>
          <input
            type="text"
            value={formData.assessor_name}
            onChange={(e) => setFormData({...formData, assessor_name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-600"
            required
            readOnly
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-populated from your profile</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assessment Date *
          </label>
          <input
            type="date"
            value={formData.assessment_date}
            onChange={(e) => setFormData({...formData, assessment_date: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Date when this assessment was completed</p>
        </div>
      </div>

      {/* Assessment Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">
          📋 Assessment Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300 font-medium">Substance:</span>
              <span className="text-blue-900 dark:text-blue-100">{formData.substance_name || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300 font-medium">COSHH Reference:</span>
              <span className="text-blue-900 dark:text-blue-100">{formData.coshh_reference || 'Not generated'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300 font-medium">Hazard Level:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                formData.hazard_level === 'High' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : formData.hazard_level === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : formData.hazard_level === 'Low'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {formData.hazard_level || 'Not Set'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300 font-medium">Assessor:</span>
              <span className="text-blue-900 dark:text-blue-100">{formData.assessor_name || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300 font-medium">Assessment Date:</span>
              <span className="text-blue-900 dark:text-blue-100">
                {formData.assessment_date ? new Date(formData.assessment_date).toLocaleDateString() : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300 font-medium">Review Date:</span>
              <span className="text-blue-900 dark:text-blue-100">
                {formData.review_date ? new Date(formData.review_date).toLocaleDateString() : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* PPE and Hazards Summary */}
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Selected PPE:</span>
              <div className="mt-1">
                {formData.selected_ppe && formData.selected_ppe.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {formData.selected_ppe.slice(0, 3).map((ppe) => (
                      <span key={ppe} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                        {ppe}
                      </span>
                    ))}
                    {formData.selected_ppe.length > 3 && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                        +{formData.selected_ppe.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-blue-600 dark:text-blue-400 text-xs">None selected</span>
                )}
              </div>
            </div>
            
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Selected Hazards:</span>
              <div className="mt-1">
                {formData.selected_hazards && formData.selected_hazards.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {formData.selected_hazards.slice(0, 3).map((hazard) => (
                      <span key={hazard} className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded text-xs">
                        {hazard}
                      </span>
                    ))}
                    {formData.selected_hazards.length > 3 && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded text-xs">
                        +{formData.selected_hazards.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-blue-600 dark:text-blue-400 text-xs">None selected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Checklist */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">
          ✅ Pre-submission Checklist
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-green-700 dark:text-green-300">
          <div className="space-y-1">
            <div>• Substance details completed</div>
            <div>• PPE requirements identified</div>
            <div>• Hazards properly assessed</div>
            <div>• Control measures documented</div>
          </div>
          <div className="space-y-1">
            <div>• Emergency procedures defined</div>
            <div>• Assessment conclusion selected</div>
            <div>• Hazard level determined</div>
            <div>• Assessor details verified</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 13 of 13:</strong> Final step! Review the assessment summary and confirm all details are correct. 
          Set the overall hazard level and verify the assessor information before submitting.
        </p>
      </div>
    </div>
  );
};
