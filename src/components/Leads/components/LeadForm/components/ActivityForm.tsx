import React from 'react';
import { Plus } from 'lucide-react';
import { Activity } from '../../shared/types';
import { ACTIVITY_TYPES } from '../../shared/constants';
import { FormField, Select, TextArea } from '../../../../../utils/form';

interface ActivityFormProps {
  newActivity: {
    type: Activity['activity_type'];
    description: string;
  };
  onActivityChange: (activity: { type: Activity['activity_type']; description: string }) => void;
  onAddActivity: () => void;
}

export function ActivityForm({ newActivity, onActivityChange, onAddActivity }: ActivityFormProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Add New Activity</h4>
      <div className="space-y-3">
        <FormField label="Activity Type">
          <Select
            id="activityType"
            value={newActivity.type}
            onChange={(e) => onActivityChange({ ...newActivity, type: e.target.value as Activity['activity_type'] })}
            options={ACTIVITY_TYPES.map(type => ({
              value: type.value,
              label: type.label
            }))}
          />
        </FormField>
        <FormField label="Description">
          <TextArea
            id="activityDescription"
            value={newActivity.description}
            onChange={(e) => onActivityChange({ ...newActivity, description: e.target.value })}
            rows={2}
            placeholder="Describe the activity..."
          />
        </FormField>
        <button
          type="button"
          onClick={onAddActivity}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Activity
        </button>
      </div>
    </div>
  );
}
