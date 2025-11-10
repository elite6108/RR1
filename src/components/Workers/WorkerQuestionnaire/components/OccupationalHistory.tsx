import React from 'react';
import { StepComponentProps } from '../types';

const CheckboxButton: React.FC<{
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}> = ({ isChecked, onChange, children }) => (
  <button
    type="button"
    onClick={() => onChange(!isChecked)}
    className={`w-full flex items-start p-4 rounded-lg text-left transition-colors
      ${isChecked ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'} 
      border-2 text-gray-700 dark:text-gray-900 hover:bg-gray-50`}
  >
    <div className="flex items-center space-x-3">
      <div
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
        ${isChecked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
      >
        {isChecked && (
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 6L4.5 9L10.5 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium">{children}</span>
    </div>
  </button>
);

export const OccupationalHistory: React.FC<StepComponentProps> = ({
  formData,
  handleChange
}) => {
  const handleCheckboxChange = (fieldName: string, checked: boolean) => {
    handleChange({
      target: {
        name: fieldName,
        type: 'checkbox',
        checked,
      },
    } as any);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
        Occupational Health History
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Please provide information about your occupational health history:
      </p>

      <div className="space-y-6">
        <CheckboxButton
          isChecked={formData.hazardousMaterialExposure}
          onChange={(checked) => handleCheckboxChange('hazardousMaterialExposure', checked)}
        >
          Have you ever been exposed to hazardous materials or processes
          (e.g., asbestos, chemicals, loud noise)?
        </CheckboxButton>

        {formData.hazardousMaterialExposure && (
          <div className="ml-6">
            <label
              htmlFor="hazardousMaterialDetails"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Please provide details:
            </label>
            <textarea
              id="hazardousMaterialDetails"
              name="hazardousMaterialDetails"
              rows={2}
              value={formData.hazardousMaterialDetails}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}

        <CheckboxButton
          isChecked={formData.workRelatedHealthProblems}
          onChange={(checked) => handleCheckboxChange('workRelatedHealthProblems', checked)}
        >
          Have you ever had any health problems that you believe were caused
          or made worse by work?
        </CheckboxButton>

        {formData.workRelatedHealthProblems && (
          <div className="ml-6">
            <label
              htmlFor="workRelatedHealthDetails"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Please provide details:
            </label>
            <textarea
              id="workRelatedHealthDetails"
              name="workRelatedHealthDetails"
              rows={2}
              value={formData.workRelatedHealthDetails}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}

        <CheckboxButton
          isChecked={formData.workRestrictions}
          onChange={(checked) => handleCheckboxChange('workRestrictions', checked)}
        >
          Do you have any health conditions or physical limitations that
          might affect your ability to perform certain types of work?
        </CheckboxButton>

        {formData.workRestrictions && (
          <div className="ml-6">
            <label
              htmlFor="workRestrictionsDetails"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Please provide details:
            </label>
            <textarea
              id="workRestrictionsDetails"
              name="workRestrictionsDetails"
              rows={2}
              value={formData.workRestrictionsDetails}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};
