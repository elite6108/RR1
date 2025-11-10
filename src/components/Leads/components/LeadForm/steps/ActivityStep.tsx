import React from 'react';
import { Lead } from '../../shared/types';
import { ActivityForm } from '../components/ActivityForm';
import { ActivityList } from '../components/ActivityList';
import { useLeadActivities } from '../../../hooks/useLeadActivities';

interface ActivityStepProps {
  leadToEdit?: Lead | null;
  currentUser?: { name: string; email: string } | null;
}

export function ActivityStep({ leadToEdit, currentUser }: ActivityStepProps) {
  const {
    activities,
    newActivity,
    setNewActivity,
    addActivity,
    deleteActivity,
  } = useLeadActivities({ leadToEdit, currentUser });

  if (!leadToEdit) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Activities will be available after creating the lead.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ActivityForm
        newActivity={newActivity}
        onActivityChange={setNewActivity}
        onAddActivity={addActivity}
      />

      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Activities</h4>
        <ActivityList
          activities={activities}
          onDeleteActivity={deleteActivity}
        />
      </div>
    </div>
  );
}
