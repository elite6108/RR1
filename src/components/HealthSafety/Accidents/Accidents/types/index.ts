export interface HSAccidentsProps {
  onBack: () => void;
  onShowReportingDashboard?: () => void;
}

export interface AccidentReport {
  id: string;
  actions: Array<{
    id?: string;
    title?: string;
    dueDate?: string;
  }>;
  incident_date?: string;
}

export interface AccidentStats {
  totalReports: number;
  pendingActions: number;
  daysSinceLastIncident: number;
  // Year to date statistics
  sevenDayIncapacitation: number;
  fatality: number;
  hospitalTreatment: number;
  illHealth: number;
  minorAccident: number;
  nonFatal: number;
  occupationalDisease: number;
  personalInjury: number;
  specifiedInjuries: number;
  dangerousOccurrence: number;
  nearMiss: number;
  environmental: number;
  propertyDamage: number;
  unsafeActions: number;
  unsafeConditions: number;
  utilityDamage: number;
}

// Map of report types to their table names
export const reportTypeToTable = {
  sevenDayIncapacitation: 'accidents_sevendayincapacitation',
  fatality: 'accidents_fatality',
  hospitalTreatment: 'accidents_hospitaltreatment',
  illHealth: 'accidents_illhealth',
  minorAccident: 'accidents_minoraccident',
  nonFatal: 'accidents_nonfatal',
  occupationalDisease: 'accidents_occupationaldisease',
  personalInjury: 'accidents_personalinjury',
  specifiedInjuries: 'accidents_specifiedinjuries',
  dangerousOccurrence: 'accidents_dangerousoccurrence',
  nearMiss: 'accidents_nearmiss',
  environmental: 'accidents_environmental',
  propertyDamage: 'accidents_propertydamage',
  unsafeActions: 'accidents_unsafeactions',
  unsafeConditions: 'accidents_unsafeconditions',
  utilityDamage: 'accidents_utilitydamage'
};
