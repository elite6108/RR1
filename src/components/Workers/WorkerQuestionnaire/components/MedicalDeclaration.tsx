import React from 'react';
import { StepComponentProps, MedicalCondition } from '../types';

const medicalConditions: MedicalCondition[] = [
  { key: 'epilepsy', label: 'Epilepsy or other fits, blackouts' },
  { key: 'blackouts', label: 'Dizziness, blackouts or fainting episodes' },
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'eyesight', label: 'Impaired eyesight (not corrected by glasses)' },
  { key: 'colorBlindness', label: 'Color blindness' },
  { key: 'hearingImpairment', label: 'Hearing impairment' },
  { key: 'physicalDisability', label: 'Physical disability or impaired mobility' },
  { key: 'arthritis', label: 'Arthritis or other joint problems' },
  { key: 'backProblems', label: 'Back problems or back pain' },
  { key: 'hernia', label: 'Hernia or rupture' },
  { key: 'hypertension', label: 'Hypertension (high blood pressure)' },
  { key: 'heartDisease', label: 'Heart disease' },
  { key: 'respiratoryDisease', label: 'Respiratory disease including asthma' },
];

const CheckboxButton: React.FC<{
  condition: MedicalCondition;
  isChecked: boolean;
  onChange: (conditionKey: keyof any, checked: boolean) => void;
}> = ({ condition, isChecked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(condition.key, !isChecked)}
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
      <span className="text-sm font-medium">{condition.label}</span>
    </div>
  </button>
);

export const MedicalDeclaration: React.FC<StepComponentProps> = ({
  formData,
  handleChange
}) => {
  const handleConditionChange = (conditionKey: keyof any, checked: boolean) => {
    handleChange({
      target: {
        name: conditionKey,
        type: 'checkbox',
        checked,
      },
    } as any);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
        Medical Declaration
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Please indicate if you have ever suffered from any of the following conditions:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {medicalConditions.map((condition) => (
          <CheckboxButton
            key={condition.key}
            condition={condition}
            isChecked={formData[condition.key] as boolean}
            onChange={handleConditionChange}
          />
        ))}
      </div>

      <div className="mt-6">
        <label
          htmlFor="medicalDetails"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          If you've ticked any of the above, please provide details:
        </label>
        <textarea
          id="medicalDetails"
          name="medicalDetails"
          rows={3}
          value={formData.medicalDetails}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="prescribedMedications"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Are you currently taking any prescribed medications? If yes, please list them:
        </label>
        <textarea
          id="prescribedMedications"
          name="prescribedMedications"
          rows={3}
          value={formData.prescribedMedications}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
};
