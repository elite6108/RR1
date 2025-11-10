import { useState, useEffect } from 'react';
import { Subcontractor, Reminder } from '../types';

export const useReminders = (subcontractors: Subcontractor[]) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const getReminders = (): Reminder[] => {
    const today = new Date();
    const reminders: Reminder[] = [];

    subcontractors.forEach((contractor) => {
      // Check main insurance expiry date
      if (contractor.insurance_exp_date) {
        const expiryDate = new Date(contractor.insurance_exp_date);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 30 || diffDays < 0) {
          reminders.push({
            type: 'insurance',
            title: contractor.company_name,
            date: expiryDate,
            description:
              diffDays < 0
                ? `Insurance expired - ${expiryDate.toLocaleDateString()}`
                : `Insurance expires in ${diffDays} days`,
            severity: diffDays <= 0 ? 'danger' : 'warning',
          });
        }
      }

      // Check all insurance types
      const insuranceTypes = [
        { name: 'Employers Liability', data: contractor.employers_liability },
        { name: 'Public Liability', data: contractor.public_liability },
        {
          name: 'Professional Negligence',
          data: contractor.professional_negligence,
        },
        { name: 'Contractors All Risk', data: contractor.contractors_all_risk },
      ];

      // Add custom insurance types
      if (contractor.custom_insurance_types) {
        Object.entries(contractor.custom_insurance_types).forEach(
          ([key, value]) => {
            insuranceTypes.push({
              name: key
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              data: value,
            });
          }
        );
      }

      insuranceTypes.forEach(({ name, data }) => {
        if (data?.renewal_date) {
          const expiryDate = new Date(data.renewal_date);
          const diffTime = expiryDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 30 || diffDays < 0) {
            reminders.push({
              type: 'insurance',
              title: `${contractor.company_name} - ${name}`,
              date: expiryDate,
              description:
                diffDays < 0
                  ? `${name} expired - ${expiryDate.toLocaleDateString()}`
                  : `${name} expires in ${diffDays} days`,
              severity: diffDays <= 0 ? 'danger' : 'warning',
            });
          }
        }
      });
    });

    // Sort reminders by date
    return reminders.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  useEffect(() => {
    setReminders(getReminders());
  }, [subcontractors]);

  return reminders;
};
