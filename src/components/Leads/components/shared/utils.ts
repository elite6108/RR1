import { Lead, Activity } from './types';
import { PRIORITY_COLORS } from './constants';

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: string | number) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount || '0') : amount;
  return `£${numAmount.toLocaleString()}`;
};

export const getStatusDisplayText = (status: string) => {
  if (status === 'hot') return 'Quote Sent';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getDisplayStatus = (status: string) => {
  return status === 'hot' ? 'sent' : status;
};

export const getDisplayStatusText = (status: string) => {
  const displayStatus = getDisplayStatus(status);
  return displayStatus === 'sent' || status === 'hot' 
    ? 'Quote Sent' 
    : displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
};

export const getPriority = (lead: Lead): 'High' | 'Medium' | 'Low' => {
  const budget = parseFloat(lead.budget || '0');
  if (lead.status === 'hot' && budget > 50000) return 'High';
  if (lead.status === 'hot' || budget > 25000) return 'Medium';
  return 'Low';
};

export const getPriorityColor = (priority: string) => {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || 'text-gray-600 dark:text-gray-400';
};

export const getActivityIcon = (type: Activity['activity_type']) => {
  switch (type) {
    case 'email_sent': return 'Mail';
    case 'phone_call': return 'Phone';
    case 'note_added': return 'MessageSquare';
    case 'status_changed': return 'Edit';
    default: return 'MessageSquare';
  }
};

export const getActivityLabel = (type: Activity['activity_type']) => {
  switch (type) {
    case 'email_sent': return 'Email Sent';
    case 'phone_call': return 'Phone Call';
    case 'note_added': return 'Note Added';
    case 'status_changed': return 'Status Changed';
    default: return 'Activity';
  }
};

export const getLeadsByStatusAndPeriod = (
  leads: Lead[], 
  status: Lead['status'], 
  days: number | null
) => {
  const now = new Date();
  
  return leads.filter(lead => {
    if (lead.status !== status) return false;
    
    if (days === null) return true; // All time
    
    const leadDate = new Date(lead.created_at);
    const daysDiff = Math.floor((now.getTime() - leadDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= days;
  }).length;
};

export const scrollToTopOnMobile = () => {
  if (window.innerWidth < 640) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export const preventBodyScroll = (shouldPrevent: boolean) => {
  if (shouldPrevent) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
};
