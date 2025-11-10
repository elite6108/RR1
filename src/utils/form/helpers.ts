// Form data utilities
export const getFormattedDate = (date?: Date): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

export const getTodayFormatted = (): string => {
  return getFormattedDate(new Date());
};

export const getDatePlusMonths = (months: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return getFormattedDate(date);
};

// Step validation helper
export const createStepValidation = (validators: Record<string, () => string | undefined>) => {
  const errors: Record<string, string | undefined> = {};
  let isValid = true;

  Object.entries(validators).forEach(([field, validator]) => {
    const error = validator();
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
