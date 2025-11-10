import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { EquipmentTableProps } from '../types';

export function EquipmentTable({ equipment, onEdit, onDelete }: EquipmentTableProps) {
  return (
    <div className="hidden lg:block">
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:rounded-tl-lg">
                  Name
                </th>
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Serial
                </th>
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Inspection Frequency
                </th>
                <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Service Frequency
                </th>
                <th scope="col" className="py-3 px-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider last:rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {equipment.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer`}
                  onClick={() => onEdit(item)}
                >
                  <td className="py-2 px-3 text-sm text-gray-900 dark:text-white first:rounded-bl-lg">
                    {item.name}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                    {item.serial_number}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                    {item.inspection_interval} {item.inspection_frequency}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                    {item.service_interval_value} {item.service_interval_unit}
                  </td>
                  <td className="py-2 px-3 text-right text-sm font-medium last:rounded-br-lg">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
