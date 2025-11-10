import React from 'react';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { NumberPlate } from '../../shared/components/NumberPlate';
import type { VehicleInventory } from '../../shared/types';

interface InventoryCardProps {
  vehicle: any;
  inventories: VehicleInventory[];
  onNewInventory: (vehicle: any) => void;
  onEditInventory: (vehicle: any, inventory: VehicleInventory) => void;
  onDeleteInventory: (inventory: VehicleInventory) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({
  vehicle,
  inventories,
  onNewInventory,
  onEditInventory,
  onDeleteInventory
}) => {
  const vehicleInventories = inventories.filter(
    (i) => i.vehicle_id === vehicle.id
  );
  
  // Get the latest inventory check for this vehicle
  const latestInventory = vehicleInventories[0]; // Already sorted by created_at desc

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <NumberPlate registration={vehicle.registration} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white break-words">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last Check: {latestInventory ? new Date(latestInventory.check_date).toLocaleDateString() : 'Never checked'}
            {latestInventory && ` by ${latestInventory.checked_by}`}
          </p>
        </div>
        <button
          onClick={() => onNewInventory(vehicle)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Inventory
        </button>
      </div>

      {vehicleInventories.length > 0 && (
        <div className="mt-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Recent Inventory Checks
              </h4>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {vehicleInventories.slice(0, 3).map((inventory) => (
                <div key={inventory.id} className="px-4 py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(inventory.check_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Checked by: {inventory.checked_by}
                      {inventory.notes && ` | ${inventory.notes.substring(0, 50)}${inventory.notes.length > 50 ? '...' : ''}`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditInventory(vehicle, inventory)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="View"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEditInventory(vehicle, inventory)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDeleteInventory(inventory)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
