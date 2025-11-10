import type { VehicleChecklist } from '../../shared/types';

export const getLastCheckInfo = (vehicleId: string, checklists: VehicleChecklist[]) => {
  const vehicleChecklists = checklists.filter(
    (c) => c.vehicle_id === vehicleId
  );
  if (vehicleChecklists.length === 0) return { date: null, frequency: null };

  const lastChecklist = vehicleChecklists[0];
  const lastCheckDate = new Date(lastChecklist.check_date);
  const today = new Date();
  let isOverdue = false;

  switch (lastChecklist.frequency) {
    case 'daily':
      isOverdue =
        today.getTime() - lastCheckDate.getTime() > 24 * 60 * 60 * 1000;
      break;
    case 'weekly':
      isOverdue =
        today.getTime() - lastCheckDate.getTime() > 7 * 24 * 60 * 60 * 1000;
      break;
    case 'monthly':
      isOverdue =
        today.getTime() - lastCheckDate.getTime() > 30 * 24 * 60 * 60 * 1000;
      break;
  }

  return {
    date: lastCheckDate.toLocaleDateString(),
    frequency: lastChecklist.frequency,
    isOverdue,
  };
};

export const formatChecklistDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatChecklistStatus = (status: string): string => {
  return status.toUpperCase();
};

export const formatChecklistFrequency = (frequency: string): string => {
  return frequency.charAt(0).toUpperCase() + frequency.slice(1);
};
