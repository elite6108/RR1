import React from 'react';
import type { TabProps } from '../../types';
import { FormField, TextInput } from '../../../../utils/form';

export function PrefixTab({ formData, handleChange }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <FormField 
        label="Prefix" 
        required 
        description="This prefix will be used as a reference in other areas of the application"
      >
        <TextInput
          id="prefix"
          value={formData.prefix || ''}
          onChange={(e) => handleChange({ target: { name: 'prefix', value: e.target.value } } as any)}
          placeholder="settings-prefix"
        />
      </FormField>
    </div>
  );
}