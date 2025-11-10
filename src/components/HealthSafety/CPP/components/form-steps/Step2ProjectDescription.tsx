import React from 'react';
import type { CPPFormData } from '../../../../types/cpp';

interface Step2ProjectDescriptionProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step2ProjectDescription({
  data,
  onChange,
}: Step2ProjectDescriptionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Project Description</h3>

      {/* Form fields will go here */}
    </div>
  );
}
