export const sections = [
  'Health Policy Signature',
  'Health',
  'Forklift Trucks',
  'Cranes',
  'Compressor',
  'Extraction',
  'Electrical',
  'Heating',
  'Fire',
  'Training',
  'Noise',
  'Air'
];

export const sectionTypes: Record<string, string[]> = {
  'Health Policy Signature': ['SIGNATURES'],
  'Health': ['SURVEILLANCE'],
  'Forklift Trucks': ['LOLER', 'THOROUGH EXAM'],
  'Cranes': ['LOLER', 'SERVICE'],
  'Compressor': ['SERVICE', 'WSE'],
  'Extraction': ['TESTING', 'SERVICE'],
  'Electrical': ['PAT', 'LANDLORD', 'EICR', 'EMERGENCY LIGHTING'],
  'Heating': ['SERVICE'],
  'Fire': ['INSPECTION', 'SERVICE'],
  'Training': ['TRAINING'],
  'Noise': ['NOISE REPORT', 'NOISE SURVEY', 'INTERNAL NOISE READING'],
  'Air': ['AIR QUALITY SAMPLING']
};
