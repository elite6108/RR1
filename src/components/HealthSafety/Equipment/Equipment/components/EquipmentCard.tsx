import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { EquipmentCardProps } from '../types';

export function EquipmentCard({ equipment, onEdit, onDelete }: EquipmentCardProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onEdit(equipment)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {equipment.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Serial: {equipment.serial_number}
          </p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Inspection Frequency:</span>
          <span className="text-gray-900 dark:text-white">
            {equipment.inspection_interval} {equipment.inspection_frequency}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Service Frequency:</span>
          <span className="text-gray-900 dark:text-white">
            {equipment.service_interval_value} {equipment.service_interval_unit}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(equipment);
          }}
          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          title="Edit"
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(equipment.id);
          }}
          className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          title="Delete"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
}
