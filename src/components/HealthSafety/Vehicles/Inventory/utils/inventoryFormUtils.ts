import type { InventoryItem, InventoryItemCheck } from '../../shared/types';

export const filterInventoryItems = (
  items: InventoryItem[],
  searchQuery: string
): InventoryItem[] => {
  if (!searchQuery.trim()) return items;
  
  const query = searchQuery.toLowerCase();
  return items.filter(item =>
    item.item_name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );
};

export const groupItemsByCategory = (
  items: InventoryItem[]
): { [category: string]: InventoryItem[] } => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [category: string]: InventoryItem[] });
};

export const createDefaultItemCheck = (itemId: string): InventoryItemCheck => ({
  id: '',
  inventory_id: '',
  item_id: itemId,
  is_present: true,
  condition_status: 'good',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const updateItemCheck = (
  currentCheck: InventoryItemCheck | undefined,
  itemId: string,
  field: keyof InventoryItemCheck,
  value: any
): InventoryItemCheck => {
  const baseCheck = currentCheck || createDefaultItemCheck(itemId);
  
  return {
    ...baseCheck,
    [field]: value,
    updated_at: new Date().toISOString(),
    // Handle specific field logic
    ...(field === 'is_present' && { is_present: value }),
    ...(field === 'condition_status' && { condition_status: value }),
  };
};

export const toggleAllSections = (
  categories: string[],
  currentCollapsedState: { [category: string]: boolean }
): { [category: string]: boolean } => {
  const allCollapsed = categories.every(cat => currentCollapsedState[cat]);
  const newState: { [category: string]: boolean } = {};
  
  categories.forEach(cat => {
    newState[cat] = !allCollapsed;
  });
  
  return newState;
};

export const validateInventoryForm = (checkedBy: string): string | null => {
  if (!checkedBy.trim()) {
    return 'Please enter who is checking the inventory';
  }
  return null;
};
