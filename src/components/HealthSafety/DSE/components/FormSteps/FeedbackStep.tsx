import React from 'react';
import { FormStepProps } from '../../types';
import { EYE_TEST_INFO } from '../../utils/constants';
import { YesNoQuestion } from './YesNoQuestion';

export function FeedbackStep({ formData, setFormData }: FormStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Step 8: Your Feedback
      </h3>
      <div className="space-y-6">
        <YesNoQuestion
          label="Have you experienced any discomfort or other symptoms from using your computer or laptop?"
          value={formData.experienced_discomfort}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              experienced_discomfort: value,
            }))
          }
        />
        
        <div className="text-sm text-gray-500">
          {EYE_TEST_INFO}
        </div>
        
        <YesNoQuestion
          label="Would you be interested in having your eye and vision tested?"
          value={formData.interested_eye_test}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              interested_eye_test: value,
            }))
          }
        />
        
        <YesNoQuestion
          label="Do you regularly take breaks working away from screens?"
          value={formData.regular_breaks}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, regular_breaks: value }))
          }
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Write down any notes or issues you have with your desk, chair,
            screen <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
