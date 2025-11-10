import React from 'react';
import { TaskFormData } from '../types';

interface TaskNotesTabProps {
  taskFormData: TaskFormData;
  setTaskFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}

export const TaskNotesTab: React.FC<TaskNotesTabProps> = ({
  taskFormData,
  setTaskFormData,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={taskFormData.notes}
          onChange={(e) =>
            setTaskFormData({ ...taskFormData, notes: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#29303b] dark:border-gray-600 dark:text-white"
          rows={10}
          placeholder="Add any additional notes or details about this task..."
        />
      </div>
      

    </div>
  );
};
