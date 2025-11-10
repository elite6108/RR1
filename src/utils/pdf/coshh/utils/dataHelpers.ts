// Helper to safely parse array fields that might be stored as JSON strings
export const parseArrayField = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [field]; // If it's just a string, treat it as single item array
    }
  }
  return [];
};

// Helper to safely parse ingredient items
export const parseIngredientItems = (field: any): Array<{ingredient_name: string; wel_twa_8_hrs: string; stel_15_mins: string}> => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Helper to build row with label and value ensuring value is string
export const buildTableRow = (label: string, value: any): any[] => {
  const displayValue = (value === undefined || value === null || value === '') ? 'N/A' : String(value);
  return [
    { content: label, styles: { fontStyle: 'bold' } },
    { content: displayValue, styles: { halign: 'left' } }
  ];
};

// Helper to format date strings
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

// Helper to get the latest update date from a collection
export const getLatestUpdateDate = (items: Array<{updated_at: string}>): string => {
  if (!items || items.length === 0) return 'N/A';
  
  try {
    const latestDate = Math.max(...items.map(item => new Date(item.updated_at).getTime()));
    return new Date(latestDate).toLocaleDateString();
  } catch {
    return 'N/A';
  }
};
