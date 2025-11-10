import React from 'react';
import type { TabProps } from '../../types';
import { FormField, TextInput } from '../../../../utils/form';

export function TaxInfoTab({ formData, handleChange }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <FormField label="Company Number" required>
        <TextInput
          id="company_number"
          value={formData.company_number || ''}
          onChange={(e) => handleChange({ target: { name: 'company_number', value: e.target.value } } as any)}
          placeholder="12345678"
        />
      </FormField>

      <FormField label="VAT Number" required>
        <TextInput
          id="vat_number"
          value={formData.vat_number || ''}
          onChange={(e) => handleChange({ target: { name: 'vat_number', value: e.target.value } } as any)}
          placeholder="GB123456789"
        />
      </FormField>
    </div>
  );
}