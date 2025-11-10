// Validation utilities for forms
export const validateRequired = (value: string | undefined | null, fieldName: string): string | undefined => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email) return undefined;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const validateDate = (date: string, fieldName: string): string | undefined => {
  if (!date) return undefined;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
  return undefined;
};

export const validateFutureDate = (date: string, fieldName: string): string | undefined => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) {
    return `${fieldName} must be in the future`;
  }
  return undefined;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | undefined => {
  if (!value) return undefined;
  if (value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return undefined;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | undefined => {
  if (!value) return undefined;
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return undefined;
};
