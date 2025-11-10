import React from 'react';
import { Pencil, Eye, Trash2 } from 'lucide-react';
import type { TrainingCardProps } from '../types';
import { DueDatesDisplay } from './DueDatesDisplay';

export function TrainingCard({ 
  training, 
  onEdit, 
  onView, 
  onDelete 
}: TrainingCardProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onEdit(training)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {training.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Position: {training.position}
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Dates:</h5>
        <div className="text-sm">
          <DueDatesDisplay training={training} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(training);
          }}
          className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
          title="Edit Training"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(training);
          }}
          className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md"
          title="View Training Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(training.id, training.name);
          }}
          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
          title="Delete Training"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}