import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import type { VehicleInventory, InventoryItem } from '../../shared/types';

export const useInventoryData = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [inventories, setInventories] = useState<VehicleInventory[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .order('registration');

      if (vehiclesError) {
        throw vehiclesError;
      }

      // Fetch inventory items (predefined and custom items)
      let inventoryItemsData = [];
      try {
        const { data, error: itemsError } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (itemsError) {
          console.warn('inventory_items table not found, using empty data:', itemsError.message);
          inventoryItemsData = [];
        } else {
          inventoryItemsData = data || [];
        }
      } catch (err) {
        console.warn('Error fetching inventory items, using empty array:', err);
        inventoryItemsData = [];
      }

      // Fetch inventories with item checks
      let inventoriesData = [];
      try {
        const { data, error: inventoriesError } = await supabase
          .from('vehicle_inventory')
          .select(`
            *,
            item_checks:inventory_item_checks(*)
          `)
          .order('created_at', { ascending: false });

        if (inventoriesError) {
          console.warn('vehicle_inventory table not found, using empty data:', inventoriesError.message);
          inventoriesData = [];
        } else {
          inventoriesData = data || [];
        }
      } catch (err) {
        console.warn('Error fetching inventory data, using empty array:', err);
        inventoriesData = [];
      }

      setVehicles(vehiclesData || []);
      setInventoryItems(inventoryItemsData);
      setInventories(inventoriesData);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const deleteInventory = async (inventoryId: string) => {
    try {
      const { error } = await supabase
        .from('vehicle_inventory')
        .delete()
        .eq('id', inventoryId);

      if (error) {
        console.warn('Error deleting inventory (table may not exist):', error.message);
        // For now, just refresh data instead of throwing error
        await fetchData();
        return;
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Error deleting inventory:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete inventory');
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    vehicles,
    inventories,
    inventoryItems,
    loading,
    error,
    fetchData,
    deleteInventory,
    setError
  };
};
