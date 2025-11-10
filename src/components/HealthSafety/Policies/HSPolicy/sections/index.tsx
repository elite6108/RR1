import React from 'react';
import { GeneralPolicyStatement } from './GeneralPolicyStatement';
import { Organisation } from './Organisation';
import { Arrangements } from './arrangements';
import type { PolicyContent } from '../../../types/policy';

interface HSPolicySectionsProps {
  onSectionSelect: (section: string) => void;
  selectedSection: string | null;
  policyContent: PolicyContent;
}

export function HSPolicySections({ onSectionSelect, selectedSection, policyContent }: HSPolicySectionsProps) {
  return (
    <div className="space-y-8">
      <GeneralPolicyStatement onSectionSelect={onSectionSelect} selectedSection={selectedSection} policyContent={policyContent} />
      <Organisation onSectionSelect={onSectionSelect} selectedSection={selectedSection} policyContent={policyContent} />
      <Arrangements onSectionSelect={onSectionSelect} selectedSection={selectedSection} policyContent={policyContent} />
    </div>
  );
}