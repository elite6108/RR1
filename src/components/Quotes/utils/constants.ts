export const statusColors = {
  new: 'bg-blue-100 text-blue-800 dark:bg-[rgb(13,50,99)] dark:text-white',
  accepted: 'bg-green-100 text-green-800 dark:bg-[rgb(4,97,36)] dark:text-white',
  rejected: 'bg-red-100 text-red-800 dark:bg-[rgb(136,19,55)] dark:text-white',
};

export const statusOrder = { 
  'new': 3, 
  'accepted': 2, 
  'rejected': 1 
} as const;
