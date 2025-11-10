import type { InventoryItem, InventoryItemCheck } from '../../shared/types';

export interface InventoryFormData {
  checkedBy: string;
  notes: string;
  itemChecks: { [itemId: string]: InventoryItemCheck };
}

export interface CustomItemFormData {
  itemName: string;
  category: string;
}

export interface InventorySearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalItems: number;
  filteredItems: number;
}

export interface InventorySectionProps {
  category: string;
  items: InventoryItem[];
  isCollapsed: boolean;
  itemChecks: { [itemId: string]: InventoryItemCheck };
  onToggleSection: (category: string) => void;
  onItemCheckChange: (itemId: string, field: keyof InventoryItemCheck, value: any) => void;
}

export interface CustomItemFormProps {
  isVisible: boolean;
  formData: CustomItemFormData;
  onFormDataChange: (data: Partial<CustomItemFormData>) => void;
  onToggleVisibility: () => void;
  onAddItem: () => Promise<void>;
  loading?: boolean;
}

export interface InventoryFormHeaderProps {
  vehicle: any;
  inventoryToEdit?: any;
  onClose: () => void;
}

export interface InventoryFormBasicInfoProps {
  checkedBy: string;
  notes: string;
  onCheckedByChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}
