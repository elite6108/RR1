import type { Contract } from '../types';

export function formatContractDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'Invalid Date';
  }
}

export function formatContractAmount(amount: number | null | undefined): string {
  if (typeof amount !== 'number') return '£0';
  
  return `£${amount.toLocaleString()}`;
}

export function formatCustomerName(customer?: Contract['customer']): string {
  if (!customer) return 'Unknown Customer';
  
  const names = [customer.company_name, customer.customer_name].filter(Boolean);
  return names.length > 0 ? names.join(' - ') : 'Unknown Customer';
}

export function formatContractFilename(contract: Contract): string {
  const contractDate = contract.contract_date ? 
    new Date(contract.contract_date).toISOString().split('T')[0] : 'undated';
  
  const customerName = contract.customer ? 
    (contract.customer.company_name || contract.customer.customer_name || 'Unknown') : 'Unknown';
  
  return `Contract-${customerName.replace(/\s+/g, '-')}-${contractDate}.pdf`;
}

export function getContractDisplayText(contract: Contract, field: keyof Contract): string {
  const value = contract[field];
  
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  if (typeof value === 'string') {
    return value || 'N/A';
  }
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  return String(value);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function getContractStatusText(contract: Contract): string {
  if (contract.is_signed) {
    return `Signed${contract.signed_at ? ` on ${formatContractDate(contract.signed_at)}` : ''}`;
  }
  return 'Pending Signature';
}

export function getContractStatusColor(contract: Contract): string {
  return contract.is_signed ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400';
}
