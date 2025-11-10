import React from 'react';
import type { TabProps } from '../../types';
import { LogoUpload } from '../LogoUpload';
import { counties } from '../../utils/constants';
import { FormField, TextInput, Select } from '../../../../utils/form';

interface CompanyInfoTabProps extends TabProps {
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploadingLogo: boolean;
}

export function CompanyInfoTab({ 
  formData, 
  handleChange, 
  handleLogoUpload, 
  uploadingLogo 
}: CompanyInfoTabProps) {
  // Convert counties array to options format
  const countyOptions = counties.map(county => ({
    value: county,
    label: county
  }));

  return (
    <div className="space-y-6">
      {/* Logo Upload Section */}
      <LogoUpload 
        formData={formData}
        handleLogoUpload={handleLogoUpload}
        uploadingLogo={uploadingLogo}
      />

      <div className="grid grid-cols-1 gap-6">
        <FormField label="Company Name" required>
          <TextInput
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange({ target: { name: 'name', value: e.target.value } } as any)}
          />
        </FormField>

        <FormField label="Address Line 1" required>
          <TextInput
            id="address_line1"
            value={formData.address_line1 || ''}
            onChange={(e) => handleChange({ target: { name: 'address_line1', value: e.target.value } } as any)}
          />
        </FormField>

        <FormField label="Address Line 2" description="(optional)">
          <TextInput
            id="address_line2"
            value={formData.address_line2 || ''}
            onChange={(e) => handleChange({ target: { name: 'address_line2', value: e.target.value } } as any)}
          />
        </FormField>

        <FormField label="Town" required>
          <TextInput
            id="town"
            value={formData.town || ''}
            onChange={(e) => handleChange({ target: { name: 'town', value: e.target.value } } as any)}
          />
        </FormField>

        <FormField label="County" required>
          <Select
            id="county"
            value={formData.county || ''}
            onChange={(e) => handleChange({ target: { name: 'county', value: e.target.value } } as any)}
            options={countyOptions}
            placeholder="Select a county"
          />
        </FormField>

        <FormField label="Post Code" required>
          <TextInput
            id="post_code"
            value={formData.post_code || ''}
            onChange={(e) => handleChange({ target: { name: 'post_code', value: e.target.value } } as any)}
          />
        </FormField>
      </div>
    </div>
  );
}