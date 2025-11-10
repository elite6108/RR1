// Note: LeadStatus type is used in the type definitions but not directly in this file

export const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800 dark:bg-[rgb(13,50,99)] dark:text-white',
  cold: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white',
  hot: 'bg-emerald-100 text-emerald-800 dark:bg-[rgb(4,120,87)] dark:text-white',
  sent: 'bg-emerald-100 text-emerald-800 dark:bg-[rgb(4,120,87)] dark:text-white',
  converted: 'bg-green-100 text-green-800 dark:bg-[rgb(4,97,36)] dark:text-white',
} as const;

export const BORDER_COLORS = {
  new: 'border-l-blue-500',
  cold: 'border-l-gray-500',
  hot: 'border-l-emerald-500',
  sent: 'border-l-emerald-500',
  converted: 'border-l-green-500',
} as const;

export const LEAD_SOURCES = [
  { value: 'Website', label: 'Website' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Google', label: 'Google' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Other', label: 'Other' },
] as const;

export const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'cold', label: 'Cold' },
  { value: 'hot', label: 'Quote Sent' },
  { value: 'converted', label: 'Converted' },
] as const;

export const ACTIVITY_TYPES = [
  { value: 'email_sent', label: 'Email Sent' },
  { value: 'phone_call', label: 'Phone Call' },
  { value: 'note_added', label: 'Note Added' },
  { value: 'status_changed', label: 'Status Changed' },
] as const;

export const FORM_STEPS = [
  { id: 1, label: 'Lead Details' },
  { id: 2, label: 'Activity' },
  { id: 3, label: 'Notes' },
] as const;

export const PRIORITY_COLORS = {
  High: 'text-red-600 dark:text-red-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  Low: 'text-green-600 dark:text-green-400',
} as const;

export const STATUS_ORDER = {
  hot: 4,
  new: 3,
  cold: 2,
  converted: 1,
} as const;

export const PRIORITY_ORDER = {
  High: 3,
  Medium: 2,
  Low: 1,
} as const;
