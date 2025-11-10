import { useState, useEffect } from 'react';
import { fetchDocumentCount } from '../utils';

/**
 * Interface for document count state
 */
interface DocumentCountsState {
  guidesCount: number;
  codeOfPracticeCount: number;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching and managing document counts
 * Used for displaying statistics on the main guidance page
 * @returns Document counts state and refresh function
 */
export const useDocumentCounts = () => {
  const [state, setState] = useState<DocumentCountsState>({
    guidesCount: 0,
    codeOfPracticeCount: 0,
    loading: true,
    error: null,
  });

  /**
   * Fetches document counts from both tables
   */
  const fetchCounts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Fetch both counts in parallel
      const [guidesCount, codeOfPracticeCount] = await Promise.all([
        fetchDocumentCount('guidance_guides'),
        fetchDocumentCount('guidance_codeofpractice'),
      ]);

      setState({
        guidesCount,
        codeOfPracticeCount,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch document counts',
        // Keep existing counts on error
      }));
    }
  };

  // Fetch counts on mount
  useEffect(() => {
    fetchCounts();
  }, []);

  return {
    ...state,
    refreshCounts: fetchCounts,
  };
};
