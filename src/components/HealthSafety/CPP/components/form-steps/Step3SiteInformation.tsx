import React from 'react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step3SiteInformationProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step3SiteInformation({ data, onChange }: Step3SiteInformationProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Site Information</h3>
      
      {/* Form fields will go here */}
    </div>
  );
}