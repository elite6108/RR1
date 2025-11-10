// Shared constants for form options
export const BASIC_CAUSE_OPTIONS = [
  'Asphyxiation',
  'Collision',
  'Contact with electricity',
  'Contact with flying particles',
  'Contact with tool/equipment/machinery',
  'Contact with/exposed to air/water pressure',
  'Contact with/exposed to hazardous substance',
  'Contact with/exposed to heat/acid',
  'Drowning',
  'Explosion',
  'Exposure to noise/vibration',
  'Fall down stairs/steps',
  'Fall from height',
  'Fall on the same level',
  'Fire',
  'Loss of containment/unintentional release',
  'Manual Handling',
  'Repetitive motion/action',
  'Step on/struck against stationary object',
  'Struck by falling object',
  'Struck by moving object',
  'Struck or trapped by something collapsing/overturning',
  'Trapped between objects',
  'Other'
];

export const SOURCE_OF_HAZARD_OPTIONS = [
  'Cold',
  'Dust',
  'Excavation',
  'Floor/ground condition',
  'Flying particle',
  'Hand tool',
  'Hazardous substance',
  'Heat/hot work',
  'Lack of oxygen',
  'Ladder',
  'Lifting equipment',
  'Materials',
  'Moving parts of machinery',
  'Power tool',
  'Proximity to water',
  'Scaffold',
  'Stairs/steps',
  'Static equipment/machinery',
  'Structure',
  'Temporary works',
  'Vehicle/mobile equipment',
  'Working surface',
  'Workstation layout',
  'Other'
];

export const ROOT_CAUSE_OPTIONS = {
  workEnvironment: [
    'Access/Egress',
    'Defective workplace',
    'Design/Layout',
    'Housekeeping',
    'Lack of room',
    'Lighting',
    'Noise/distraction',
    'Weather',
    'Other'
  ],
  humanFactors: [
    'Error of judgement',
    'Failure to adhere to the RAs',
    'Failure to follow rules',
    'Fatigue',
    'Horseplay',
    'Instructions misunderstood',
    'Lack of experience',
    'Lapse in concentration',
    'Undue haste',
    'Unsafe attitude',
    'Working without authorisation',
    'Other'
  ],
  ppe: [
    'Design',
    'Maintenance/defective',
    'Not provided/unavailable',
    'Not used',
    'Work type',
    'Other'
  ],
  management: [
    'RAMS not communicated',
    'Supervision',
    'System Failure',
    'Training',
    'Other'
  ],
  plantEquipment: [
    'Construction/design',
    'Installation',
    'Maintenance',
    'Mechanical failure',
    'Operation/use',
    'Safety device',
    'Other'
  ]
};
