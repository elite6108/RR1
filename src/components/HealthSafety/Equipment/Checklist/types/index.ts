// Extend the DB type to include a temporary client-side URL
export interface ChecklistItem extends DbChecklistItem {
  signed_url?: string;
}

export interface EquipmentChecklistFormProps {
  equipment: Equipment;
  checklistToEdit?: EquipmentChecklist | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface ChecklistsListProps {
  onBack: () => void;
}

export interface ChecklistTableProps {
  checklists: EquipmentChecklist[];
  equipment: Equipment[];
  onEdit: (equipment: Equipment, checklist: EquipmentChecklist) => void;
  onDelete: (checklist: EquipmentChecklist) => void;
  onViewPDF: (checklist: EquipmentChecklist) => void;
  generatingPdfId: string | null;
}

export interface ChecklistCardProps {
  checklist: EquipmentChecklist;
  equipment: Equipment;
  onEdit: (equipment: Equipment, checklist: EquipmentChecklist) => void;
  onDelete: (checklist: EquipmentChecklist) => void;
  onViewPDF: (checklist: EquipmentChecklist) => void;
  generatingPdfId: string | null;
}

export interface ChecklistItemFormProps {
  item: ChecklistItem;
  index: number;
  availableItems: string[];
  onItemChange: (id: string, field: keyof ChecklistItem, value: string) => void;
  onImageUpload: (itemId: string, file: File) => void;
  onRemoveImage: (itemId: string) => void;
  onRemoveItem: (id: string) => void;
  uploadingImage: string | null;
}

export interface ChecklistFormStepsProps {
  currentStep: number;
  createdByName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  items: ChecklistItem[];
  notes: string;
  onCreatedByNameChange: (name: string) => void;
  onFrequencyChange: (frequency: 'daily' | 'weekly' | 'monthly') => void;
  onNotesChange: (notes: string) => void;
  onAddItem: () => void;
  onItemChange: (id: string, field: keyof ChecklistItem, value: string) => void;
  onImageUpload: (itemId: string, file: File) => void;
  onRemoveImage: (itemId: string) => void;
  onRemoveItem: (id: string) => void;
  uploadingImage: string | null;
  availableItems: string[];
}

// Re-export from database types
import type { 
  Equipment, 
  EquipmentChecklist, 
  ChecklistItem as DbChecklistItem 
} from '../../../../../types/database';

export type { 
  Equipment, 
  EquipmentChecklist, 
  ChecklistItem as DbChecklistItem 
} from '../../../../../types/database';
