import React from 'react';
import { StepComponentProps } from '../types';
import { SignatureCanvas } from './SignatureCanvas';

export const Declaration: React.FC<StepComponentProps & {
  workerName: string;
  onSignatureChange: (signature: string) => void;
}> = ({
  formData,
  handleChange,
  workerName,
  onSignatureChange
}) => {
  const handleConfirmationChange = (checked: boolean) => {
    handleChange({
      target: {
        name: 'confirmationChecked',
        type: 'checkbox',
        checked,
      },
    } as any);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
        Declaration & Consent
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Please read and complete the declaration below:
      </p>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300">
        <p>
          I declare that the information provided in this questionnaire is true
          and complete to the best of my knowledge and belief. I understand
          that:
        </p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>
            Any false statement or deliberate omission may disqualify me from
            employment or result in dismissal.
          </li>
          <li>
            We may use the information provided to comply with its legal
            obligations.
          </li>
          <li>
            It is my responsibility to inform my employer of any changes to my
            health that might affect my ability to work safely.
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={workerName}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <SignatureCanvas onSignatureChange={onSignatureChange} />

      <div className="mt-4">
        <label
          htmlFor="submissionDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Date
        </label>
        <input
          type="date"
          id="submissionDate"
          name="submissionDate"
          value={formData.submissionDate}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <button
        type="button"
        onClick={() => handleConfirmationChange(!formData.confirmationChecked)}
        className={`w-full flex items-start p-4 rounded-lg text-left transition-colors mt-4
          ${formData.confirmationChecked
            ? 'bg-blue-50 border-blue-200'
            : 'bg-white border-gray-200'
          } 
          border-2 text-gray-700 dark:text-gray-900 hover:bg-gray-50`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
            ${formData.confirmationChecked
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300'
            }`}
          >
            {formData.confirmationChecked && (
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
          <span className="text-sm font-medium">
            I confirm that the information I have provided is accurate and
            complete to the best of my knowledge. *
          </span>
        </div>
      </button>
    </div>
  );
};
