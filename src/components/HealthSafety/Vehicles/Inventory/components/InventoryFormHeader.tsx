import React from 'react';
import { X } from 'lucide-react';
import { NumberPlate } from '../../shared/components/NumberPlate';
import type { InventoryFormHeaderProps } from '../types/formTypes';

export const InventoryFormHeader = ({
  vehicle,
  inventoryToEdit,
  onClose
}: InventoryFormHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
               <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {inventoryToEdit ? 'Edit' : 'New'} Vehicle Inventory
          </h2>
          <div className="flex items-center">
            <NumberPlate registration={vehicle.registration} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {vehicle.make} {vehicle.model}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
};
