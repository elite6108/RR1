export interface HSAccidentsReportsProps {
  onBack: () => void;
}

export interface Report {
  id: string;
  auto_id: string;
  report_type: string;
  category: string;
  created_at: string;
  incident_date?: string;
  table_name: string;
}

export interface FormOption {
  id: string;
  label: string;
  formType: string;
}

export interface FormOptions {
  accident: FormOption[];
  nearmiss: FormOption[];
  incident: FormOption[];
}

export interface FormProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
  initialData?: any;
  isEditing: boolean;
}

// List of all accident report tables
export const accidentTables = [
  'accidents_dangerousoccurrence',
  'accidents_environmental',
  'accidents_fatality',
  'accidents_hospitaltreatment',
  'accidents_illhealth',
  'accidents_minoraccident',
  'accidents_nearmiss',
  'accidents_nonfatal',
  'accidents_occupationaldisease',
  'accidents_personalinjury',
  'accidents_propertydamage',
  'accidents_sevendayincapacitation',
  'accidents_specifiedinjuries',
  'accidents_unsafeactions',
  'accidents_unsafeconditions',
  'accidents_utilitydamage'
];

// Form options organized by category
export const formOptions: FormOptions = {
  accident: [
    { id: '7dayincapacitation', label: '7 Day Incapacitation', formType: 'sevendayincapacitation' },
    { id: 'fatality', label: 'Fatality', formType: 'fatality' },
    { id: 'hospitaltreatment', label: 'Hospital Treatment', formType: 'hospitaltreatment' },
    { id: 'illhealth', label: 'Ill Health', formType: 'illhealth' },
    { id: 'minoraccident', label: 'Minor Accident', formType: 'minoraccident' },
    { id: 'nonfatal', label: 'Non Fatal', formType: 'nonfatal' },
    { id: 'occupationaldisease', label: 'Occupational Disease', formType: 'occupationaldisease' },
    { id: 'personalinjury', label: 'Personal Injury', formType: 'personalinjury' },
    { id: 'specifiedinjuries', label: 'Specified Injuries', formType: 'specifiedinjuries' },
  ],
  nearmiss: [
    { id: 'dangerousoccurrence', label: 'Dangerous Occurrence', formType: 'dangerousoccurrence' },
    { id: 'nearmiss', label: 'Near Miss', formType: 'nearmiss' },
  ],
  incident: [
    { id: 'environmental', label: 'Environmental', formType: 'environmental' },
    { id: 'propertydamage', label: 'Property Damage', formType: 'propertydamage' },
    { id: 'unsafeactions', label: 'Unsafe Actions', formType: 'unsafeactions' },
    { id: 'unsafeconditions', label: 'Unsafe Conditions', formType: 'unsafeconditions' },
    { id: 'utilitydamage', label: 'Utility Damage', formType: 'utilitydamage' },
  ],
};
