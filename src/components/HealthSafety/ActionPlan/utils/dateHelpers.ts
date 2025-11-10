export const formatDateToUK = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const calculateNextDue = (lastDone: string, intervalMonths: string): string => {
  if (!lastDone || !intervalMonths) return '';
  
  const lastDoneDate = new Date(lastDone);
  const months = parseInt(intervalMonths);
  
  if (isNaN(months)) return '';
  
  const nextDueDate = new Date(lastDoneDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + months);
  
  return nextDueDate.toISOString().split('T')[0];
};
