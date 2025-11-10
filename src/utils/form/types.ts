// Generic form types that can be reused across the application

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface StepValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}
