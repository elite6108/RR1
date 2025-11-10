import { useState, useMemo } from 'react';
import type { RAMS } from '../types/rams';

export const useRamsSearch = (rams: RAMS[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRams = useMemo(() => {
    if (!searchQuery.trim()) {
      return rams;
    }

    const query = searchQuery.toLowerCase();
    return rams.filter(ram => {
      return (
        ram.rams_number?.toLowerCase().includes(query) ||
        ram.project_name?.toLowerCase().includes(query) ||
        ram.site_name?.toLowerCase().includes(query) ||
        ram.task_description?.toLowerCase().includes(query) ||
        ram.client_name?.toLowerCase().includes(query) ||
        ram.client_company?.toLowerCase().includes(query)
      );
    });
  }, [rams, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredRams
  };
};
