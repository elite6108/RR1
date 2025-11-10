export interface RiskAssessmentData {
  id: string;
  name: string;
  ra_id: string;
  created_at: string;
  review_date: string;
  last_signed: string | null;
  signatures?: any[];
  [key: string]: any;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ReviewStatus {
  text: string;
  className: string;
}

export interface SignatureStatus {
  text: string;
  className: string;
}

export const getReviewStatus = (reviewDate: string): ReviewStatus => {
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

export const getSignatureStatus = (lastSigned: string | null): SignatureStatus => {
  if (!lastSigned) {
    return {
      text: 'Not signed',
      className: 'text-red-600 dark:text-red-400'
    };
  }

  const signedDate = new Date(lastSigned);
  const today = new Date();
  const daysDifference = Math.floor((today.getTime() - signedDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDifference > 365) {
    return {
      text: 'Overdue',
      className: 'text-red-600 dark:text-red-400 font-medium'
    };
  }

  return {
    text: signedDate.toLocaleDateString(),
    className: 'text-green-600 dark:text-green-400'
  };
};

export const filterAndSortRiskAssessments = (
  riskAssessments: RiskAssessmentData[],
  searchQuery: string,
  sortConfig: SortConfig | null
): RiskAssessmentData[] => {
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
      if (sortConfig.key === 'last_signed') {
        // Handle null values for last_signed
        const dateA = a.last_signed ? new Date(a.last_signed).getTime() : 0;
        const dateB = b.last_signed ? new Date(b.last_signed).getTime() : 0;
        return sortConfig.direction === 'asc' 
          ? dateA - dateB
          : dateB - dateA;
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

export const handleSort = (
  key: string,
  sortConfig: SortConfig | null,
  setSortConfig: (config: SortConfig | null) => void
) => {
  let direction: 'asc' | 'desc' = 'asc';
  if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });
};