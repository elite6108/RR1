export interface EquipmentFormData {
  category: string;
  name: string;
  serial_number: string;
  location: string;
  purchase_date: string;
  warranty_expiry: string;
  inspection_interval: string;
  inspection_frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Annually';
  inspection_notes: string;
  service_interval_value: string;
  service_interval_unit: 'Mile' | 'Hour' | 'Day' | 'Week' | 'Month' | 'Year';
  service_notes: string;
  notes: string;
}

export interface EquipmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  equipmentToEdit?: Equipment | null;
}

export interface EquipmentListProps {
  onBack: () => void;
}

export interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: (equipment: Equipment) => void;
  onDelete: (equipmentId: string) => void;
}

export interface EquipmentTableProps {
  equipment: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (equipmentId: string) => void;
}

// Re-export from database types
import type { Equipment } from '../../../../../types/database';
export type { Equipment } from '../../../../../types/database';
