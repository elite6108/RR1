// Re-export all types from sub-modules
export * from '../../Equipment/types';
export * from '../../Checklist/types';

// Shared interface for reminders
export interface Reminder {
  type: 'equipment' | 'checklist';
  title: string;
  date: Date;
  description: string;
  severity: 'warning' | 'danger';
}

// Main component props
export interface HSEquipmentProps {
  onBack: () => void;
  onOverdueChecklistsChange?: (count: number) => void;
}
