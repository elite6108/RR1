export const calculateTotalDays = (start: Date, end: Date, type: string): number => {
  if (type.startsWith('half_day')) return 0.5;
  
  // Count only weekdays (Monday to Friday)
  let workingDays = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workingDays;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'text-green-600 bg-green-50';
    case 'denied': return 'text-red-600 bg-red-50';
    default: return 'text-yellow-600 bg-yellow-50';
  }
};
