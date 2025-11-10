import type { StaffMember, User, Worker, CombinedStaffUser, Driver, DriverWithStaff, Reminder } from '../types';

export const combineStaffAndUsers = (
  availableStaff: StaffMember[],
  users: User[],
  workers: Worker[]
): CombinedStaffUser[] => {
  return [
    // Add staff members
    ...availableStaff.map(staffMember => ({
      id: `staff_${staffMember.id}`,
      name: staffMember.name,
      type: 'staff' as const,
      original_id: staffMember.id.toString(),
      email: staffMember.email || '',
      position: staffMember.position
    })),
    // Add users, but exclude those who already exist as staff
    ...users.filter(user => !availableStaff.some(staffMember => staffMember.name === user.full_name))
      .map(user => ({
        id: `user_${user.id}`,
        name: user.full_name || user.email || 'Unknown User',
        type: 'user' as const,
        original_id: user.id,
        email: user.email
      })),
    // Add workers
    ...workers.map(worker => ({
      id: `worker_${worker.id}`,
      name: worker.full_name || worker.email || 'Unknown Worker',
      type: 'worker' as const,
      original_id: worker.id,
      email: worker.email,
      company: worker.company,
      phone: worker.phone
    }))
  ];
};

export const getDateStatus = (date: string | null) => {
  if (!date) return { text: '-', color: 'text-gray-500' };

  const expiryDate = new Date(date);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: new Date(date).toLocaleDateString(),
      color: 'text-red-600',
    };
  } else if (diffDays <= 30) {
    return {
      text: new Date(date).toLocaleDateString(),
      color: 'text-orange-500',
    };
  }
  return {
    text: new Date(date).toLocaleDateString(),
    color: 'text-green-600',
  };
};

export const getExpiryColor = (expiryDate: string | null): string => {
  if (!expiryDate) return 'text-gray-500 dark:text-gray-300';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(expiryDate);
  date.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'text-red-600 dark:text-red-400 font-bold'; // Expired
  }
  if (diffDays < 30) {
    return 'text-orange-500 dark:text-orange-400 font-semibold'; // 0-29 days
  }
  if (diffDays < 60) {
    return 'text-yellow-500 dark:text-yellow-400 font-semibold'; // 30-59 days
  }
  return 'text-gray-500 dark:text-gray-300'; // 60+ days
};

export const getCheckColor = (checkDate: string | null): string => {
  if (!checkDate) return 'text-gray-500 dark:text-gray-300';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(checkDate);
  date.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 10) { // Passed or < 10 days
    return 'text-red-600 dark:text-red-400 font-bold';
  }
  if (diffDays < 30) { // 10-29 days
    return 'text-orange-500 dark:text-orange-400 font-semibold';
  }
   if (diffDays > 60) { // More than 60 days
    return 'text-green-700 dark:text-green-500 font-semibold';
  }
  if (diffDays > 30) { // 31-60 days
    return 'text-green-500 dark:text-green-400 font-semibold';
  }
  return 'text-gray-500 dark:text-gray-300';
};

export const generateReminders = (vehicles: any[], drivers: DriverWithStaff[]): Reminder[] => {
  const today = new Date();
  const reminders: Reminder[] = [];

  // Vehicle reminders
  vehicles.forEach((vehicle) => {
    const dates = [
      { name: 'MOT', date: vehicle.mot_date },
      { name: 'Tax', date: vehicle.tax_date },
      { name: 'Service', date: vehicle.service_date },
      { name: 'Insurance', date: vehicle.insurance_date },
      { name: 'Breakdown Cover', date: vehicle.breakdown_date },
      { name: 'Congestion Charge', date: vehicle.congestion_date },
      { name: 'Dartford Crossing', date: vehicle.dartford_date },
      { name: 'Clean Air Zone', date: vehicle.clean_air_date },
    ];

    dates.forEach(({ name, date }) => {
      if (date) {
        const expiryDate = new Date(date);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 30 || diffDays < 0) {
          reminders.push({
            type: 'vehicle',
            title: `${vehicle.make} ${vehicle.model} (${vehicle.registration})`,
            date: expiryDate,
            description:
              diffDays < 0
                ? `${name} expired - ${expiryDate.toLocaleDateString()}`
                : `${name} expires in ${diffDays} days`,
            severity: diffDays <= 7 ? 'danger' : 'warning',
          });
        }
      }
    });
  });

  // Driver reminders
  drivers.forEach((driver) => {
    if (!driver.licence_expiry) return;

    const expiryDate = new Date(driver.licence_expiry);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30 || diffDays < 0) {
      reminders.push({
        type: 'driver',
        title: driver.staff?.name || driver.full_name || 'Unknown Driver',
        date: expiryDate,
        description:
          diffDays < 0
            ? `Licence expired - ${expiryDate.toLocaleDateString()}`
            : `Licence expires in ${diffDays} days`,
        severity: diffDays <= 7 ? 'danger' : 'warning',
      });
    }
  });

  // Sort reminders by date
  return reminders.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const calculateOverdueDrivers = (drivers: DriverWithStaff[]): number => {
  const today = new Date();
  return drivers.filter((driver) => {
    if (!driver.licence_expiry) return false;
    const expiryDate = new Date(driver.licence_expiry);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 || diffDays < 0;
  }).length;
};

export const calculateOverdueVehicles = (vehicles: any[]): number => {
  const today = new Date();
  return vehicles.reduce((count, vehicle) => {
    const dates = [
      { name: 'MOT', date: vehicle.mot_date },
      { name: 'Tax', date: vehicle.tax_date },
      { name: 'Service', date: vehicle.service_date },
      { name: 'Insurance', date: vehicle.insurance_date },
      { name: 'Breakdown Cover', date: vehicle.breakdown_date },
      { name: 'Congestion Charge', date: vehicle.congestion_date },
      { name: 'Dartford Crossing', date: vehicle.dartford_date },
      { name: 'Clean Air Zone', date: vehicle.clean_air_date },
    ];

    return (
      count +
      dates.filter(({ date }) => {
        if (!date) return false;
        const expiryDate = new Date(date);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 || diffDays < 0;
      }).length
    );
  }, 0);
};
