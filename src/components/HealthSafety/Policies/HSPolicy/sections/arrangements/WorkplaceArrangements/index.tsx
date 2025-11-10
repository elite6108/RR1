import React from 'react';
import { AsbestosArrangements } from './AsbestosArrangements';
import { GeneralWorkArrangements } from './GeneralWorkArrangements';
import { HealthSafetyArrangements } from './HealthSafetyArrangements';
import { HeightWorkArrangements } from './HeightWorkArrangements';

interface WorkplaceArrangementsProps {
  onSectionSelect: (section: string) => void;
  selectedSection: string | null;
}

export function WorkplaceArrangements({ onSectionSelect, selectedSection }: WorkplaceArrangementsProps) {
  return (
    <div className="space-y-6">
      <GeneralWorkArrangements onSectionSelect={onSectionSelect} selectedSection={selectedSection} />
      <AsbestosArrangements onSectionSelect={onSectionSelect} selectedSection={selectedSection} />
      <HealthSafetyArrangements onSectionSelect={onSectionSelect} selectedSection={selectedSection} />
      <HeightWorkArrangements onSectionSelect={onSectionSelect} selectedSection={selectedSection} />
    </div>
  );
}