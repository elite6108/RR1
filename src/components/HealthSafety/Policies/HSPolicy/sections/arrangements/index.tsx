import React from 'react';
import { GeneralPolicies } from './GeneralPolicies';
import { OfficeArrangements } from './OfficeArrangements';
import { WorkplaceArrangements } from './WorkplaceArrangements';
import type { PolicyContent } from '../../../../types/policy';

interface ArrangementsProps {
  onSectionSelect: (section: string) => void;
  selectedSection: string | null;
  policyContent: PolicyContent;
}

export function Arrangements({ onSectionSelect, selectedSection, policyContent }: ArrangementsProps) {
  return (
    <div className="space-y-8">
      <GeneralPolicies onSectionSelect={onSectionSelect} selectedSection={selectedSection} policyContent={policyContent} />
      <OfficeArrangements onSectionSelect={onSectionSelect} selectedSection={selectedSection} policyContent={policyContent} />
      <WorkplaceArrangements onSectionSelect={onSectionSelect} selectedSection={selectedSection} policyContent={policyContent} />
    </div>
  );
}