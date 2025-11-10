export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

export const getDateStatus = (dateString: string): 'expired' | 'due_soon' | 'ok' => {
  const date = new Date(dateString);
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  if (date < today) {
    return 'expired';
  } else if (date <= thirtyDaysFromNow) {
    return 'due_soon';
  }
  return 'ok';
};

export const getStatusLabel = (status: string, type: 'insurance' | 'review'): string => {
  switch (status) {
    case 'expired':
      return type === 'insurance' ? 'Expired' : 'Review Now';
    case 'due_soon':
      return 'Due Soon';
    default:
      return '';
  }
};

export const getStatusStyle = (status: string): string => {
  switch (status) {
    case 'expired':
      return 'text-red-600';
    case 'due_soon':
      return 'text-orange-500';
    default:
      return 'text-gray-900';
  }
};

// Check if insurance date is in the 60-365 day range (show in green)
export const isInsuranceDateGreen = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Green if between 60 and 365 days from today
  return diffDays >= 60 && diffDays <= 365;
};

// Check if review date is over 60 days from today (show in green)
export const isReviewDateGreen = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Green if over 60 days from today
  return diffDays > 60;
};

// Get the appropriate text color class for insurance dates
export const getInsuranceDateStyle = (dateString: string): string => {
  if (isInsuranceDateGreen(dateString)) {
    return 'text-green-600 dark:text-green-400';
  }
  
  const status = getDateStatus(dateString);
  return getStatusStyle(status);
};

// Get the appropriate text color class for review dates
export const getReviewDateStyle = (dateString: string): string => {
  if (isReviewDateGreen(dateString)) {
    return 'text-green-600 dark:text-green-400';
  }
  
  const status = getDateStatus(dateString);
  return getStatusStyle(status);
};
