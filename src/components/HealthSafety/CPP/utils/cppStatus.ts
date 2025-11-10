import type { CPP } from '../../../../types/database';

export interface CPPStatusInfo {
  statusClass: string;
  statusText: string;
  statusBadgeClass?: string;
  daysUntilReview: number;
}

export function getCPPStatus(cpp: CPP): CPPStatusInfo {
  const reviewDate = new Date(cpp.review_date);
  const today = new Date();
  const daysUntilReview = Math.floor(
    (reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let statusClass: string;
  let statusText: string;
  let statusBadgeClass: string;

  if (daysUntilReview < 0) {
    statusClass = 'text-red-600 dark:text-red-400';
    statusText = 'Review Overdue';
    statusBadgeClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  } else if (daysUntilReview <= 30) {
    statusClass = 'text-yellow-600 dark:text-yellow-400';
    statusText = 'Review Due Soon';
    statusBadgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
  } else {
    statusClass = 'text-green-600 dark:text-green-400';
    statusText = 'Active';
    statusBadgeClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  }

  return {
    statusClass,
    statusText,
    statusBadgeClass,
    daysUntilReview,
  };
}
