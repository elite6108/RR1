import React from 'react';
import { FormField, TextArea } from '../../../../../utils/form';
import type { FormStepProps } from '../../types';

export function Step3Notes({
  formData,
  loading = false,
  handleInputChange,
}: FormStepProps) {
  const createInputChangeHandler = (fieldName: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (handleInputChange) {
      handleInputChange({ ...e, target: { ...e.target, name: fieldName } });
    }
  };

  return (
    <div className="space-y-6">
      <FormField label="Additional Notes" description="(optional)">
        <TextArea
          value={formData.notes || ''}
          onChange={createInputChangeHandler('notes')}
          disabled={loading}
          rows={6}
          placeholder="Enter any additional notes or special instructions for this purchase order..."
        />
      </FormField>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Ready to Submit
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                Review your purchase order details above. Once submitted, you can still edit the order if needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}