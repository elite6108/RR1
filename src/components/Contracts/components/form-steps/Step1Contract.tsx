import React from 'react';
import { format } from 'date-fns';
import type { FormStepProps } from '../../types';
import { Calendar } from '../../../../utils/calendar/Calendar';

export function Step1Contract({ formData, handleInputChange, contract }: FormStepProps & { contract?: any }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 text-blue-800 rounded-md mb-4 dark:bg-blue-900/20 dark:text-blue-200">
        <p className="text-sm">
          This Contract Generator will request specific details about the
          project and the associated work. The information provided, along with
          the terms, definitions, and agreed wording, will be included in the
          final PDF version of this contract.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Contract ID <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          type="text"
          name="contract_id"
          value={formData.contract_id}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none"
          placeholder="Automatically generated on save"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Contract Date *
        </label>
        <Calendar
          selectedDate={formData.contract_date}
          onDateSelect={(date) => {
            const event = { target: { name: 'contract_date', value: date } } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(event);
          }}
          isDisabled={contract ? () => false : (date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          placeholder="Select contract date"
          className="w-full"
        />
      </div>
    </div>
  );
}