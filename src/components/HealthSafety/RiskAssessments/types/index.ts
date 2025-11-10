export interface RiskAssessmentSubpageProps {
  onBack: () => void;
  setShowRiskAssessmentsubpage: (show: boolean) => void;
  setActiveSection: (section: string) => void;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ReviewStatus {
  text: string;
  className: string;
}
