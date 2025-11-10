import { useState, useMemo } from 'react';
import type { CPP } from '../../../../types/database';

export function useCPPSearch(cpps: CPP[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCPPs = useMemo(() => {
    return cpps.filter((cpp) =>
      cpp.cpp_number.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cpps, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredCPPs,
  };
}
