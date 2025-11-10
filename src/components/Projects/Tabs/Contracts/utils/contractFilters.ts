import type { Contract } from '../types';

export function filterContracts(contracts: Contract[], searchQuery: string): Contract[] {
  if (!searchQuery.trim()) {
    return contracts;
  }

  const query = searchQuery.toLowerCase();
  
  return contracts.filter(contract => {
    // Search in customer information
    const customerMatch = 
      contract.customer?.company_name?.toLowerCase().includes(query) ||
      contract.customer?.customer_name?.toLowerCase().includes(query);
    
    // Search in project name
    const projectMatch = contract.project_name?.toLowerCase().includes(query);
    
    // Search in description of works
    const descriptionMatch = contract.description_of_works?.toLowerCase().includes(query);
    
    // Search in site address
    const siteMatch = contract.site_address?.toLowerCase().includes(query);
    
    // Search in contract date
    const dateMatch = contract.contract_date && 
      new Date(contract.contract_date).toLocaleDateString().toLowerCase().includes(query);
    
    return customerMatch || projectMatch || descriptionMatch || siteMatch || dateMatch;
  });
}

export function sortContracts(contracts: Contract[], sortBy: 'date' | 'customer' | 'amount' = 'date', ascending = false): Contract[] {
  return [...contracts].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'date':
        const dateA = new Date(a.contract_date || 0).getTime();
        const dateB = new Date(b.contract_date || 0).getTime();
        compareValue = dateA - dateB;
        break;
      
      case 'customer':
        const customerA = a.customer?.company_name || a.customer?.customer_name || '';
        const customerB = b.customer?.company_name || b.customer?.customer_name || '';
        compareValue = customerA.localeCompare(customerB);
        break;
      
      case 'amount':
        compareValue = (a.payment_amount || 0) - (b.payment_amount || 0);
        break;
    }
    
    return ascending ? compareValue : -compareValue;
  });
}

export function getContractSearchableText(contract: Contract): string {
  const searchableFields = [
    contract.customer?.company_name,
    contract.customer?.customer_name,
    contract.project_name,
    contract.description_of_works,
    contract.site_address,
    contract.contract_date ? new Date(contract.contract_date).toLocaleDateString() : null
  ];
  
  return searchableFields
    .filter(field => field && typeof field === 'string')
    .join(' ')
    .toLowerCase();
}
