import { useState, useMemo } from 'react';
import type { CPP, SearchState } from '../types';

/**
 * Custom hook for handling CPP search and filtering
 */
export function useSearchFilter(cpps: CPP[]) {
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: '',
  });

  /**
   * Parses front_cover data if it's a JSON string
   */
  const parseFrontCover = (frontCover: any) => {
    if (typeof frontCover === 'string') {
      try {
        return JSON.parse(frontCover);
      } catch (e) {
        // If parsing fails, return the original front_cover
        return frontCover;
      }
    }
    return frontCover;
  };

  /**
   * Filters CPPs based on search query
   */
  const filteredCpps = useMemo(() => {
    const query = searchState.searchQuery.toLowerCase();
    if (!query) return cpps;

    return cpps.filter(cpp => {
      // Get front_cover object, parsing it if needed
      const frontCover = parseFrontCover(cpp.front_cover);

      return (
        cpp.cpp_number?.toString().toLowerCase().includes(query) ||
        frontCover?.projectName?.toString().toLowerCase().includes(query) ||
        frontCover?.clientName?.toString().toLowerCase().includes(query) ||
        frontCover?.siteAddress?.toString().toLowerCase().includes(query) ||
        frontCover?.principalContractor?.toString().toLowerCase().includes(query)
      );
    });
  }, [cpps, searchState.searchQuery]);

  /**
   * Updates the search query
   */
  const setSearchQuery = (query: string) => {
    setSearchState(prev => ({
      ...prev,
      searchQuery: query,
    }));
  };

  /**
   * Clears the search query
   */
  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery: searchState.searchQuery,
    filteredCpps,
    setSearchQuery,
    clearSearch,
  };
}
