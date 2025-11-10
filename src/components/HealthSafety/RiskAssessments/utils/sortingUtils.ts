import type { RiskAssessment } from '../../../../types/database';
import type { SortConfig } from '../types';

export const getReviewStatus = (reviewDate: string) => {
  const review = new Date(reviewDate);
  const today = new Date();
  const daysUntilReview = Math.floor((review.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilReview < 0) {
    return {
      text: 'Review Overdue',
      className: 'bg-red-100 text-red-800'
    };
  } else if (daysUntilReview <= 30) {
    return {
      text: 'Review Due Soon',
      className: 'bg-yellow-100 text-yellow-800'
    };
  }
  return {
    text: 'Active',
    className: 'bg-green-100 text-green-800'
  };
};

export const sortAndFilterAssessments = (
  riskAssessments: RiskAssessment[],
  searchQuery: string,
  sortConfig: SortConfig | null
) => {
  let filteredAssessments = [...riskAssessments];
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredAssessments = filteredAssessments.filter(assessment => 
      assessment.name.toLowerCase().includes(query) ||
      assessment.ra_id?.toString().includes(query)
    );
  }

  // Apply sorting
  if (sortConfig) {
    filteredAssessments.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortConfig.key === 'ra_id') {
        return sortConfig.direction === 'asc'
          ? (a.ra_id || '').localeCompare(b.ra_id || '')
          : (b.ra_id || '').localeCompare(a.ra_id || '');
      }
      if (sortConfig.key === 'created_at') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortConfig.key === 'review_date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.review_date).getTime() - new Date(b.review_date).getTime()
          : new Date(b.review_date).getTime() - new Date(a.review_date).getTime();
      }
      if (sortConfig.key === 'status') {
        const statusA = getReviewStatus(a.review_date).text;
        const statusB = getReviewStatus(b.review_date).text;
        return sortConfig.direction === 'asc' 
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
      }
      return 0;
    });
  }

  return filteredAssessments;
};
