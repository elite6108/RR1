import type { AddressData } from '../types';

// Helper function to format section content
export const formatContent = (content: any): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  
  if (Array.isArray(content)) {
    return content.map(item => {
      if (typeof item === 'string') return item;
      return Object.values(item).join(': ');
    }).join('\n');
  }
  
  return Object.entries(content)
    .map(([key, value]) => {
      if (value === null || value === undefined) return '';
      
      // Convert camelCase to Title Case
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      if (Array.isArray(value)) {
        return `${formattedKey}:\n${value.map(item => `  • ${item}`).join('\n')}`;
      }
      if (typeof value === 'object') {
        return `${formattedKey}:\n${Object.entries(value)
          .map(([subKey, subValue]) => {
            const formattedSubKey = subKey
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .trim();
            return `  ${formattedSubKey}: ${subValue}`;
          })
          .join('\n')}`;
      }
      return `${formattedKey}: ${value}`;
    })
    .filter(text => text)
    .join('\n\n');
};

// Helper function to format address
export const formatAddress = (address: AddressData): string => {
  if (!address) return '';
  const parts = [
    address.line1,
    address.line2,
    address.town,
    address.county,
    address.postCode
  ].filter(part => part);
  return parts.join(', ');
};
