export const FIRST_AID_KIT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'expired', label: 'Expired' },
  { value: 'needs_inspection', label: 'Needs Inspection' }
] as const;

export const INSPECTION_STATUS_OPTIONS = [
  { value: 'passed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
  { value: 'needs_attention', label: 'Needs Attention' }
] as const;

export const ITEM_STATUS_OPTIONS = [
  { value: 'sufficient', label: 'Sufficient' },
  { value: 'low', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'expired', label: 'Expired' }
] as const;

export const DEFAULT_FIRST_AID_ITEMS = [
  { name: 'Adhesive Bandages (Assorted)', requiredQuantity: 20 },
  { name: 'Sterile Gauze Pads (2x2)', requiredQuantity: 10 },
  { name: 'Sterile Gauze Pads (4x4)', requiredQuantity: 5 },
  { name: 'Medical Tape', requiredQuantity: 2 },
  { name: 'Antiseptic Wipes', requiredQuantity: 10 },
  { name: 'Instant Cold Compress', requiredQuantity: 2 },
  { name: 'Disposable Gloves', requiredQuantity: 4 },
  { name: 'CPR Face Shield', requiredQuantity: 1 },
  { name: 'Scissors', requiredQuantity: 1 },
  { name: 'Tweezers', requiredQuantity: 1 },
  { name: 'Emergency Blanket', requiredQuantity: 1 },
  { name: 'First Aid Manual', requiredQuantity: 1 }
];
