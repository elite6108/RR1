import { AdditionalWork } from '../types';

/**
 * Filter additional works based on search query
 */
export const filterAdditionalWorks = (
  works: AdditionalWork[],
  searchQuery: string
): AdditionalWork[] => {
  if (!searchQuery.trim()) return works;
  
  const query = searchQuery.toLowerCase();
  return works.filter(work =>
    work.title.toLowerCase().includes(query) ||
    work.description.toLowerCase().includes(query) ||
    work.agreed_with.toLowerCase().includes(query)
  );
};

/**
 * Format filename for PDF generation
 */
export const formatPDFFilename = (work: AdditionalWork): string => {
  const formattedDate = new Date(work.created_at).toISOString().split('T')[0];
  const sanitizedTitle = work.title.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  return `Additional-Work-${sanitizedTitle}-${formattedDate}.pdf`;
};

/**
 * Validate form data
 */
export const validateFormData = (data: {
  title: string;
  description: string;
  agreed_amount: string;
  agreed_with: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!data.agreed_amount.trim()) {
    errors.agreed_amount = 'Agreed amount is required';
  } else {
    const amount = parseFloat(data.agreed_amount.replace(/[^0-9.]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      errors.agreed_amount = 'Please enter a valid amount';
    }
  }

  if (!data.agreed_with.trim()) {
    errors.agreed_with = 'Agreed with field is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Clean numeric input to allow only numbers and decimal points
 */
export const cleanNumericInput = (value: string): string => {
  return value.replace(/[^0-9.]/g, '');
};

/**
 * Format date for display
 */
export const formatDisplayDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Check if device is iOS
 */
export const isIOSDevice = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Prevent body scroll when modal is open
 */
export const toggleBodyScroll = (isModalOpen: boolean): (() => void) => {
  if (isModalOpen) {
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    document.body.style.overflow = 'unset';
  }

  // Return cleanup function
  return () => {
    document.body.style.overflow = 'unset';
  };
};

/**
 * Constants for the component
 */
export const CONSTANTS = {
  STEP_LABELS: ['Details', 'Amounts'],
  TOTAL_STEPS: 2,
  DEFAULT_VAT_TYPE: 'Inc VAT' as const,
  VAT_TYPES: ['Inc VAT', 'Plus VAT'] as const,
} as const;
