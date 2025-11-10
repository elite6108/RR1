export interface PolicyData {
  id: string;
  name: string;
  source: 'other_policy_files' | 'hs_policy_files';
  created_at: string;
  last_signed: string | null;
  display_name?: string;
  file_name?: string;
  type?: string;
  content?: string;
  policy_number?: number;
  description?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface SignatureStatus {
  text: string;
  className: string;
}

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

export const filterAndSortPolicies = (
  policies: PolicyData[],
  searchQuery: string,
  sortConfig: SortConfig | null
): PolicyData[] => {
  let filtered = policies.filter(policy =>
    policy.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortConfig) {
    filtered.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
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
      return 0;
    });
  }

  return filtered;
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