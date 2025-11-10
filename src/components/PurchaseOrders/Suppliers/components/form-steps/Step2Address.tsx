import React from 'react';
import { COUNTY_LIST } from '../../utils/constants';
import { FormField, TextInput, Select } from '../../../../../utils/form';
import type { FormStepProps } from '../../types';

export function Step2Address({ formData, handleChange }: FormStepProps) {
  const countyOptions = [
    { value: '', label: 'Select a county' },
    ...COUNTY_LIST.map(county => ({ value: county, label: county }))
  ];

  const createChangeHandler = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleChange({ ...e, target: { ...e.target, name: fieldName } });
  };

  return (
    <>
      <FormField label="Address Line 1" required>
        <TextInput
          value={formData.address_line1}
          onChange={createChangeHandler('address_line1')}
          placeholder="Enter address line 1"
        />
      </FormField>

      <FormField label="Address Line 2" description="(optional)">
        <TextInput
          value={formData.address_line2}
          onChange={createChangeHandler('address_line2')}
          placeholder="Enter address line 2 (optional)"
        />
      </FormField>

      <FormField label="Town" required>
        <TextInput
          value={formData.town}
          onChange={createChangeHandler('town')}
          placeholder="Enter town"
        />
      </FormField>

      <FormField label="County" required>
        <Select
          value={formData.county}
          onChange={createChangeHandler('county')}
          options={countyOptions}
        />
      </FormField>

      <FormField label="Post Code" required>
        <TextInput
          value={formData.post_code}
          onChange={createChangeHandler('post_code')}
          placeholder="Enter post code"
        />
      </FormField>
    </>
  );
}