import React from 'react';
import { CoshhAssessment } from '../../types';

interface Step12AssessmentConclusionProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
}

export const Step12AssessmentConclusion: React.FC<Step12AssessmentConclusionProps> = ({
  formData,
  setFormData
}) => {
  const conclusionOptions = [
    {
      value: "Option 1: The task is safe to be carried out with current control procedures",
      title: "Option 1: The task is safe to be carried out with current control procedures",
      description: "This means no additional action is necessary",
      color: "green"
    },
    {
      value: "Option 2: The task is considered safe to proceed, provided the actions listed are carried out",
      title: "Option 2: The task is considered safe to proceed, provided the actions listed are carried out",
      description: "This means substance is not currently presenting major issues but still requires some action to meet COSHH standards. Actions should be prioritised and target dates set for completion.",
      color: "yellow"
    },
    {
      value: "Option 3: The task or substance is currently unsafe, with serious breaches of health and safety regulations",
      title: "Option 3: The task or substance is currently unsafe, with serious breaches of health and safety regulations",
      description: "This means the task or substance poses a potential risk of serious harm to users; its use must be suspended until identified issues are fully resolved.",
      color: "red"
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = "flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-opacity-50 cursor-pointer transition-all duration-200";
    
    if (isSelected) {
      switch (color) {
        case 'green':
          return `${baseClasses} bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-100`;
        case 'yellow':
          return `${baseClasses} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-900 dark:text-yellow-100`;
        case 'red':
          return `${baseClasses} bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100`;
        default:
          return `${baseClasses} bg-gray-50 dark:bg-gray-700 border-gray-500`;
      }
    } else {
      return `${baseClasses} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700`;
    }
  };

  const getRadioClasses = (color: string, isSelected: boolean) => {
    if (isSelected) {
      switch (color) {
        case 'green':
          return "text-green-600";
        case 'yellow':
          return "text-yellow-600";
        case 'red':
          return "text-red-600";
        default:
          return "text-gray-600";
      }
    }
    return "text-gray-400";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        COSHH Assessment Conclusion
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Select which option is best suited for this substance based on your assessment:
      </p>
      
      <div className="space-y-4">
        {conclusionOptions.map((option) => {
          const isSelected = formData.assessment_conclusion === option.value;
          
          return (
            <label 
              key={option.value}
              className={getColorClasses(option.color, isSelected)}
            >
              <input
                type="radio"
                name="assessment_conclusion"
                value={option.value}
                checked={isSelected}
                onChange={(e) => setFormData({...formData, assessment_conclusion: e.target.value})}
                className={`mt-1 ${getRadioClasses(option.color, isSelected)}`}
              />
              <div className="flex-1">
                <div className="font-medium">
                  {option.title}
                </div>
                <div className="text-sm mt-1 opacity-90">
                  {option.description}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Assessment Summary */}
      {formData.assessment_conclusion && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            📋 Selected Conclusion
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {formData.assessment_conclusion}
          </p>
        </div>
      )}

      {/* Guidance for Each Option */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          📖 Decision Guidance
        </h4>
        <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-start space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-0.5 flex-shrink-0"></div>
            <div>
              <strong>Option 1 (Safe):</strong> Choose when all control measures are adequate, 
              exposure is well-controlled, and no additional actions are needed.
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mt-0.5 flex-shrink-0"></div>
            <div>
              <strong>Option 2 (Conditional):</strong> Choose when the substance can be used safely 
              but requires specific actions or improvements to be implemented.
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full mt-0.5 flex-shrink-0"></div>
            <div>
              <strong>Option 3 (Unsafe):</strong> Choose when serious hazards exist, 
              controls are inadequate, or immediate action is required to prevent harm.
            </div>
          </div>
        </div>
      </div>

      {/* Action Required Notice */}
      {formData.assessment_conclusion === conclusionOptions[1].value && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            ⚠️ Actions Required
          </h4>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Since you've selected Option 2, ensure that all necessary actions identified in this assessment 
            are prioritized with target dates for completion. Review the "Additional Controls" and 
            "Further Controls Required" sections.
          </p>
        </div>
      )}

      {formData.assessment_conclusion === conclusionOptions[2].value && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            🚨 Immediate Action Required
          </h4>
          <p className="text-xs text-red-700 dark:text-red-300">
            <strong>STOP:</strong> The use of this substance must be suspended immediately until all 
            identified issues are resolved. Implement emergency controls and seek expert advice before 
            allowing any further use.
          </p>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 12 of 13:</strong> Select the most appropriate conclusion based on your comprehensive 
          assessment of the substance's risks and the adequacy of current control measures.
        </p>
      </div>
    </div>
  );
};
