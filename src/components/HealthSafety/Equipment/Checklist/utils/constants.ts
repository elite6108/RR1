export const CHECKLIST_ITEMS = [
  'Visual Inspection',
  'Functionality Test',
  'Safety Features',
  'Calibration Check',
  'Power Supply',
  'Connections/Cables',
  'Display/Controls',
  'Cleanliness',
  'Damage Assessment',
  'Storage Condition'
];

export const CHECKLIST_FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;

export const CHECKLIST_STATUSES = ['pass', 'fail', 'n/a'] as const;

export type ChecklistFrequency = typeof CHECKLIST_FREQUENCIES[number];
export type ChecklistStatus = typeof CHECKLIST_STATUSES[number];
