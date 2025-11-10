export { Calendar, type CalendarProps } from './Calendar';

// Common date utility functions that can be used with the Calendar component
export const createDateValidator = (minDate?: Date, maxDate?: Date) => {
  return (date: Date): boolean => {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (minDate) {
      const minDateStart = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      if (checkDate < minDateStart) return true;
    }
    
    if (maxDate) {
      const maxDateStart = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      if (checkDate > maxDateStart) return true;
    }
    
    return false;
  };
};

// Utility for inspection forms - allows any date (no restrictions)
export const createInspectionDateValidator = () => {
  return () => false; // Return false means no dates are disabled
};

// Utility for future dates only (e.g., scheduling)
export const createFutureDateValidator = () => {
  const today = new Date();
  return createDateValidator(today);
};

// Utility for past dates only (e.g., historical records)
export const createPastDateValidator = () => {
  const today = new Date();
  return (date: Date): boolean => {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return checkDate > todayStart;
  };
};
