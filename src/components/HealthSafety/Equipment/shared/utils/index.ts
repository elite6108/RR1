import type { Equipment, EquipmentChecklist, Reminder } from '../types';

/**
 * Generate reminders based on equipment and checklists data
 */
export function generateReminders(
  equipment: Equipment[], 
  checklists: EquipmentChecklist[]
): Reminder[] {
  const today = new Date();
  const reminders: Reminder[] = [];

  // Equipment calibration/service reminders
  equipment.forEach((item) => {
    const dates = [
      { name: 'Calibration', date: (item as any).calibration_date },
      { name: 'Service', date: (item as any).service_date },
    ];

    dates.forEach(({ name, date }) => {
      if (date) {
        const expiryDate = new Date(date);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 30 || diffDays < 0) {
          reminders.push({
            type: 'equipment',
            title: item.name,
            date: expiryDate,
            description:
              diffDays < 0
                ? `${name} expired - ${expiryDate.toLocaleDateString()}`
                : `${name} due in ${diffDays} days`,
            severity: diffDays <= 7 ? 'danger' : 'warning',
          });
        }
      }
    });

    // Check for checklist reminders
    const latestChecklist = checklists
      .filter((c) => c.equipment_id === item.id)
      .sort(
        (a, b) =>
          new Date(b.check_date).getTime() - new Date(a.check_date).getTime()
      )[0];

    if (latestChecklist) {
      const lastCheckDate = new Date(latestChecklist.check_date);
      let nextCheckDate = new Date(lastCheckDate);

      // Calculate next check date based on frequency
      switch (latestChecklist.frequency) {
        case 'daily':
          nextCheckDate.setDate(lastCheckDate.getDate() + 1);
          break;
        case 'weekly':
          nextCheckDate.setDate(lastCheckDate.getDate() + 7);
          break;
        case 'monthly':
          nextCheckDate.setMonth(lastCheckDate.getMonth() + 1);
          break;
      }

      const diffTime = nextCheckDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7 || diffDays < 0) {
        reminders.push({
          type: 'checklist',
          title: item.name,
          date: nextCheckDate,
          description:
            diffDays < 0
              ? `${latestChecklist.frequency} checklist overdue by ${Math.abs(
                  diffDays
                )} days`
              : `${latestChecklist.frequency} checklist due in ${diffDays} days`,
          severity: diffDays < 0 ? 'danger' : 'warning',
        });
      }
    } else {
      // No checklist exists for this equipment
      reminders.push({
        type: 'checklist',
        title: item.name,
        date: today,
        description: 'No checklist records found',
        severity: 'danger',
      });
    }
  });

  // Sort reminders by date
  return reminders.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Count overdue checklist reminders
 */
export function countOverdueChecklists(reminders: Reminder[]): number {
  return reminders.filter(
    reminder => reminder.type === 'checklist' && reminder.severity === 'danger'
  ).length;
}
