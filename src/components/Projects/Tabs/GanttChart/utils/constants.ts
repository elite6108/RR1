// Constants for Gantt chart configuration
export const ganttColumns = [
  {
    id: 'text',
    header: 'Task name',
    align: 'left' as const,
  },
  {
    id: 'start',
    header: 'Start date',
    align: 'center' as const,
  },
  {
    id: 'duration',
    header: 'Duration',
    align: 'center' as const,
  },
  {
    id: 'action',
    header: '',
    width: 1,
    align: 'center' as const,
  },
];

export const dayStyle = (date: Date) => {
  const weekday = date.getDay();
  return weekday === 0 || weekday === 6 ? 'sday' : '';
};

export const ganttScales = [
  { unit: 'month' as const, step: 1, format: 'MMMM yyyy' },
  { unit: 'day' as const, step: 1, format: 'd', css: dayStyle }
];

export const getDefaultFormData = () => ({
  text: '',
  description: '',
  start: (() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  })(),
  end: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  })(),
  duration: 1,
  progress: 0,
  type: 'task' as const,
});
