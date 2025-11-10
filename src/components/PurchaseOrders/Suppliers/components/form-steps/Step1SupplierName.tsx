import React from 'react';
import { FormField, TextInput } from '../../../../../utils/form';
import type { FormStepProps } from '../../types';

export function Step1SupplierName({ formData, handleChange }: FormStepProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({ ...e, target: { ...e.target, name: 'name' } });
  };

  return (
    <FormField label="Supplier Name" required>
      <TextInput
        value={formData.name}
        onChange={handleNameChange}
        placeholder="Enter supplier name"
      />
    </FormField>
  );
}