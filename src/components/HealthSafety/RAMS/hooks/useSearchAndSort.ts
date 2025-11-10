import { useState, useMemo } from 'react';
import type { RAMS } from '../../../../types/database';

export function useSearchAndSort(ramsEntries: RAMS[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredEntries = useMemo(() => {
    let filteredEntries = [...ramsEntries];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredEntries = filteredEntries.filter(entry => 
        entry.rams_number?.toString().toLowerCase().includes(query) ||
        entry.client_name?.toLowerCase().includes(query) ||
        entry.site_town?.toLowerCase().includes(query) ||
        entry.site_county?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig) {
      filteredEntries.sort((a, b) => {
        if (sortConfig.key === 'rams_number') {
          return sortConfig.direction === 'asc' 
            ? (a.rams_number || '').localeCompare(b.rams_number || '')
            : (b.rams_number || '').localeCompare(a.rams_number || '');
        }
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortConfig.key === 'client_name') {
          return sortConfig.direction === 'asc' 
            ? (a.client_name || '').localeCompare(b.client_name || '')
            : (b.client_name || '').localeCompare(a.client_name || '');
        }
        if (sortConfig.key === 'site') {
          const siteA = `${a.site_town}, ${a.site_county}`;
          const siteB = `${b.site_town}, ${b.site_county}`;
          return sortConfig.direction === 'asc' 
            ? siteA.localeCompare(siteB)
            : siteB.localeCompare(siteA);
        }
        return 0;
      });
    }

    return filteredEntries;
  }, [ramsEntries, searchQuery, sortConfig]);

  return {
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    sortedAndFilteredEntries
  };
}
