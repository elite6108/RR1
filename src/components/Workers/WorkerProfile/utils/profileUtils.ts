export interface WorkerFormData {
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  national_insurance: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  photo_url: string;
  driving_licence_number: string;
}

export interface PasswordData {
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateFormData = (formData: WorkerFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!formData.full_name.trim()) {
    errors.full_name = 'Full Name is required.';
  }
  
  if (!formData.dob) {
    errors.dob = 'Date of Birth is required.';
  }
  
  if (!formData.phone.trim()) {
    errors.phone = 'Phone is required.';
  }
  
  if (!formData.emergency_contact_name.trim()) {
    errors.emergency_contact_name = 'Emergency Contact Name is required.';
  }
  
  if (!formData.emergency_contact_phone.trim()) {
    errors.emergency_contact_phone = 'Emergency Contact Phone is required.';
  }
  
  return errors;
};

export const validatePassword = (passwordData: PasswordData): string | null => {
  if (passwordData.password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  if (passwordData.password !== passwordData.confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

export const getTabForField = (fieldName: string): string => {
  const fieldToTab: { [key: string]: string } = {
    full_name: 'profile',
    dob: 'profile',
    phone: 'contact',
    emergency_contact_name: 'emergency',
    emergency_contact_phone: 'emergency',
  };
  
  return fieldToTab[fieldName] || 'profile';
};

export const validateFileUpload = (file: File): string | null => {
  const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/heif'];
  
  if (!allowedMimeTypes.includes(file.type)) {
    return 'File type not allowed. Please upload JPG, PNG or HEIF images only.';
  }
  
  // Validate file size (10MB = 10 * 1024 * 1024 bytes)
  if (file.size > 10 * 1024 * 1024) {
    return 'File size exceeds 10MB limit.';
  }
  
  return null;
};

export const generatePhotoFileName = (email: string, fileExtension: string): string => {
  return `${email.replace('@', '_at_')}_${Date.now()}.${fileExtension}`;
};