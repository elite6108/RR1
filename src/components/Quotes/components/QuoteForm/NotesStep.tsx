import React from 'react';
import { formatNumber } from '../../utils/formatters';
import { FormField, TextArea, Select } from '../../../../utils/form';

interface NotesStepProps {
  formData: {
    notes: string;
    payment_terms: string;
    due_payable: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  paymentTerms: { seven_days: string; thirty_days: string } | null;
  customPaymentTerms: boolean;
  setCustomPaymentTerms: (value: boolean) => void;
  overrideSubtotal: boolean;
  includeVat: boolean;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
}

export const NotesStep = ({
  formData,
  setFormData,
  paymentTerms,
  customPaymentTerms,
  setCustomPaymentTerms,
  overrideSubtotal,
  includeVat,
  calculateSubtotal,
  calculateTotal,
}) => {
  const duePayableOptions = [
    { value: '', label: 'Select payment terms' },
    { value: 'Payment Due Instantly', label: 'Payment Due Instantly' },
    { value: 'Payment Due Upon Receipt', label: 'Payment Due Upon Receipt' },
    { value: '7 Days', label: '7 Days' },
    { value: '30 Days', label: '30 Days' }
  ];

  return (
    <div className="space-y-6">
      <FormField label="Notes" description="(optional)">
        <TextArea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={4}
          placeholder="Enter any additional notes"
        />
      </FormField>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Payment Terms <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setCustomPaymentTerms(!customPaymentTerms);
              if (customPaymentTerms) {
                // Clear payment terms when switching back to standard terms
                setFormData(prev => ({ ...prev, payment_terms: '' }));
              }
            }}
            className={`text-sm font-medium ${
              customPaymentTerms ? 'text-indigo-600' : 'text-gray-500'
            } hover:text-indigo-500`}
          >
            {customPaymentTerms ? 'Use Standard Terms' : 'Add Custom Terms'}
          </button>
        </div>
        {customPaymentTerms ? (
          <TextArea
            value={formData.payment_terms}
            onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value }))}
            rows={4}
            placeholder="Enter custom payment terms"
          />
        ) : (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
            {paymentTerms ? `${paymentTerms.seven_days} / ${paymentTerms.thirty_days}` : 'Standard payment terms will be applied'}
          </div>
        )}
      </div>

      <FormField label="Due & Payable" description="(optional)">
        <Select
          value={formData.due_payable}
          onChange={(e) => setFormData(prev => ({ ...prev, due_payable: e.target.value }))}
          options={duePayableOptions}
        />
      </FormField>

      {/* Quote Summary Section */}
      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Quote Summary</h3>
        <div className="text-lg font-medium space-y-1 p-4 bg-gray-50 rounded-lg">
          <div className="text-gray-600">
            Subtotal: £{calculateSubtotal().toFixed(2)}
          </div>
          {includeVat && (
            <div className="text-gray-600">
              VAT (20%): £{formatNumber(calculateSubtotal() * 0.2)}
            </div>
          )}
          <div className="text-gray-900 font-bold">
            Total: £{formatNumber(calculateTotal())}
          </div>
          
          <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-1 ${overrideSubtotal ? 'bg-indigo-600' : 'bg-gray-400'}`}></span>
              {overrideSubtotal ? 'Using manual subtotal' : 'Calculated from items'}
            </div>
            <div className="flex items-center ml-4">
              <span className={`inline-block w-3 h-3 rounded-full mr-1 ${includeVat ? 'bg-indigo-600' : 'bg-gray-400'}`}></span>
              {includeVat ? 'Including 20% VAT' : 'Excluding VAT'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
