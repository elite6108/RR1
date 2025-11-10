import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { InventoryItem, InventoryItemCheck, VehicleInventory } from '../../shared/types';
import type { InventoryFormData, CustomItemFormData } from '../types/formTypes';
import { 
  filterInventoryItems, 
  groupItemsByCategory, 
  updateItemCheck,
  toggleAllSections,
  validateInventoryForm 
} from '../utils/inventoryFormUtils';

interface UseInventoryFormProps {
  vehicle: any;
  inventoryToEdit?: VehicleInventory | null;
  onSuccess: () => void;
}

export const useInventoryForm = ({ vehicle, inventoryToEdit, onSuccess }: UseInventoryFormProps) => {
  // Form state
  const [formData, setFormData] = useState<InventoryFormData>({
    checkedBy: '',
    notes: '',
    itemChecks: {}
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState(true);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<{ [category: string]: boolean }>({});
  
  // Custom item state
  const [showAddCustomItem, setShowAddCustomItem] = useState(false);
  const [customItemData, setCustomItemData] = useState<CustomItemFormData>({
    itemName: '',
    category: 'extra'
  });
  
  // Data state
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // Initialize user info
  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setFormData(prev => ({ ...prev, checkedBy: user.user_metadata.full_name }));
      }
    };
    getUserInfo();
  }, []);

  // Load inventory data
  useEffect(() => {
    const loadInventoryData = async () => {
      setLoadingItems(true);
      try {
        const { data: items, error: itemsError } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (itemsError) throw itemsError;
        setInventoryItems(items || []);

        if (inventoryToEdit) {
          setFormData(prev => ({
            ...prev,
            checkedBy: inventoryToEdit.checked_by,
            notes: inventoryToEdit.notes || ''
          }));

          if (inventoryToEdit.item_checks) {
            const checksMap: { [itemId: string]: InventoryItemCheck } = {};
            inventoryToEdit.item_checks.forEach(check => {
              checksMap[check.item_id] = check;
            });
            setFormData(prev => ({ ...prev, itemChecks: checksMap }));
          }
        }
      } catch (err) {
        console.error('Error loading inventory data:', err);
        setError('Failed to load inventory items');
      } finally {
        setLoadingItems(false);
      }
    };

    loadInventoryData();
  }, [inventoryToEdit]);

  // Computed values
  const filteredItems = filterInventoryItems(inventoryItems, searchQuery);
  const itemsByCategory = groupItemsByCategory(filteredItems);
  const categories = Object.keys(itemsByCategory).sort();

  // Handlers
  const handleItemCheckChange = (itemId: string, field: keyof InventoryItemCheck, value: any) => {
    setFormData(prev => ({
      ...prev,
      itemChecks: {
        ...prev.itemChecks,
        [itemId]: updateItemCheck(prev.itemChecks[itemId], itemId, field, value)
      }
    }));
  };

  const handleToggleSection = (category: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleToggleAllSections = () => {
    setCollapsedSections(toggleAllSections(categories, collapsedSections));
  };

  const handleAddCustomItem = async () => {
    if (!customItemData.itemName.trim()) {
      setError('Please enter an item name');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: newItem, error: insertError } = await supabase
        .from('inventory_items')
        .insert({
          item_name: customItemData.itemName.trim(),
          category: customItemData.category,
          is_custom: true,
          created_by_user_id: user.id,
          display_order: inventoryItems.length + 1
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setInventoryItems(prev => [...prev, newItem]);
      setCustomItemData({ itemName: '', category: 'extra' });
      setShowAddCustomItem(false);
      
      // Auto-check the new item
      handleItemCheckChange(newItem.id, 'is_present', true);
      handleItemCheckChange(newItem.id, 'condition_status', 'good');
      
      setSuccessMessage(`"${customItemData.itemName}" has been added to the inventory`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error('Error adding custom item:', err);
      setError('Failed to add custom item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateInventoryForm(formData.checkedBy);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let inventoryId: string;

      if (inventoryToEdit) {
        const { error: updateError } = await supabase
          .from('vehicle_inventory')
          .update({
            checked_by: formData.checkedBy,
            notes: formData.notes || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', inventoryToEdit.id);

        if (updateError) throw updateError;
        inventoryId = inventoryToEdit.id;

        const { error: deleteError } = await supabase
          .from('inventory_item_checks')
          .delete()
          .eq('inventory_id', inventoryId);

        if (deleteError) throw deleteError;
      } else {
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('vehicle_inventory')
          .insert({
            vehicle_id: vehicle.id,
            user_id: user.id,
            checked_by: formData.checkedBy,
            notes: formData.notes || null,
          })
          .select()
          .single();

        if (inventoryError) throw inventoryError;
        inventoryId = inventoryData.id;
      }

      const itemCheckData = Object.values(formData.itemChecks).map(check => ({
        inventory_id: inventoryId,
        item_id: check.item_id,
        is_present: check.is_present,
        condition_status: check.condition_status,
        notes: check.notes || null,
        replacement_date: check.replacement_date || null,
      }));

      if (itemCheckData.length > 0) {
        const { error: checksError } = await supabase
          .from('inventory_item_checks')
          .insert(itemCheckData);

        if (checksError) throw checksError;
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving inventory:', err);
      setError(err instanceof Error ? err.message : 'Failed to save inventory');
    } finally {
      setLoading(false);
    }
  };

  return {
    // Form data
    formData,
    setFormData,
    
    // UI state
    loading,
    error,
    successMessage,
    loadingItems,
    
    // Search and filter
    searchQuery,
    setSearchQuery,
    filteredItems,
    
    // Sections
    collapsedSections,
    categories,
    itemsByCategory,
    
    // Custom items
    showAddCustomItem,
    setShowAddCustomItem,
    customItemData,
    setCustomItemData,
    
    // Data
    inventoryItems,
    
    // Handlers
    handleItemCheckChange,
    handleToggleSection,
    handleToggleAllSections,
    handleAddCustomItem,
    handleSubmit,
  };
};
