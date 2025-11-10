export const EQUIPMENT_CATEGORIES = [
  'Fixed Plant',
  'Hand Tools',
  'Lifting Equipment',
  'Lifting Accessories',
  'Machinery',
  'Mobile Plant',
  'Portable Electrical Equipment',
  'Power Tools',
  'PPE',
  'RPE',
  'Working at Height Equipment'
] as const;

export const INTERVAL_UNITS = [
  'Mile',
  'Hour',
  'Day',
  'Week',
  'Month',
  'Year'
] as const;

export const INSPECTION_FREQUENCIES = [
  'Daily',
  'Weekly',
  'Monthly',
  'Annually'
] as const;

export type EquipmentCategory = typeof EQUIPMENT_CATEGORIES[number];
export type IntervalUnit = typeof INTERVAL_UNITS[number];
export type InspectionFrequency = typeof INSPECTION_FREQUENCIES[number];
