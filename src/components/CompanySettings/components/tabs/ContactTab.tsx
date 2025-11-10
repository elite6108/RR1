import React from 'react';
import type { TabProps } from '../../types';
import { FormField, TextInput } from '../../../../utils/form';

export function ContactTab({ formData, handleChange }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <FormField label="Phone" required>
        <TextInput
          type="tel"
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => handleChange({ target: { name: 'phone', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Email" required>
        <TextInput
          type="email"
          id="email"
          value={formData.email || ''}
          onChange={(e) => handleChange({ target: { name: 'email', value: e.target.value } } as any)}
        />
      </FormField>
    </div>
  );
}