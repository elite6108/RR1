import React from 'react';
import type { TabProps } from '../../types';
import { FormField, TextInput, TextArea } from '../../../../utils/form';

export function InsurancesTab({ formData, handleChange }: TabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <FormField label="Public Liability" required>
        <TextInput
          id="public_liability"
          value={formData.public_liability || ''}
          onChange={(e) => handleChange({ target: { name: 'public_liability', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Employers Liability" required>
        <TextInput
          id="employers_liability"
          value={formData.employers_liability || ''}
          onChange={(e) => handleChange({ target: { name: 'employers_liability', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Products Liability" description="(optional)">
        <TextInput
          id="products_liability"
          value={formData.products_liability || ''}
          onChange={(e) => handleChange({ target: { name: 'products_liability', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Professional Indemnity" description="(optional)">
        <TextInput
          id="professional_indemnity"
          value={formData.professional_indemnity || ''}
          onChange={(e) => handleChange({ target: { name: 'professional_indemnity', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Contractors' All Risk" description="(optional)">
        <TextInput
          id="contractors_risk"
          value={formData.contractors_risk || ''}
          onChange={(e) => handleChange({ target: { name: 'contractors_risk', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Plant & Machinery" description="(optional)">
        <TextInput
          id="plant_machinery"
          value={formData.plant_machinery || ''}
          onChange={(e) => handleChange({ target: { name: 'plant_machinery', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Owned Plant Insurance" description="(optional)">
        <TextInput
          id="owned_plant"
          value={formData.owned_plant || ''}
          onChange={(e) => handleChange({ target: { name: 'owned_plant', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Hired Plant Insurance" description="(optional)">
        <TextInput
          id="hired_plant"
          value={formData.hired_plant || ''}
          onChange={(e) => handleChange({ target: { name: 'hired_plant', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Environmental Liability" description="(optional)">
        <TextInput
          id="environmental_liability"
          value={formData.environmental_liability || ''}
          onChange={(e) => handleChange({ target: { name: 'environmental_liability', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Latent Defects Insurance" description="(optional)">
        <TextInput
          id="latent_defects"
          value={formData.latent_defects || ''}
          onChange={(e) => handleChange({ target: { name: 'latent_defects', value: e.target.value } } as any)}
        />
      </FormField>

      <FormField label="Other Insurances" description="(optional)">
        <TextArea
          id="other_insurances"
          rows={3}
          value={formData.other_insurances || ''}
          onChange={(e) => handleChange({ target: { name: 'other_insurances', value: e.target.value } } as any)}
        />
      </FormField>
    </div>
  );
}