export const formatNumber = (num: number) => {
  return num.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getStatusDisplayText = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const maskAccountNumber = (accountNumber: string) => {
  if (!accountNumber) return '';
  return '••••••••';
};

export const maskSortCode = (sortCode: string) => {
  if (!sortCode) return '';
  return '••-••-••';
};
