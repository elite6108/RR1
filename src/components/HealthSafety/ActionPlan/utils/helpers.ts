import { ActionPlanItem } from '../types';

export const truncateNotes = (notes: string, maxWords: number = 5): string => {
  if (!notes) return '';
  const words = notes.trim().split(/\s+/);
  if (words.length <= maxWords) return notes;
  return words.slice(0, maxWords).join(' ') + '...';
};

export const sectionHasDescriptions = (actionPlans: ActionPlanItem[], section: string): boolean => {
  return actionPlans
    .filter(plan => plan.section === section)
    .some(plan => plan.description && plan.description.trim().length > 0);
};

export const sectionHasSerials = (actionPlans: ActionPlanItem[], section: string): boolean => {
  return actionPlans
    .filter(plan => plan.section === section)
    .some(plan => plan.serials && plan.serials.trim().length > 0);
};

export const getItemsDueInDays = (actionPlans: ActionPlanItem[], days: number): number => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return actionPlans.filter(plan => {
    if (!plan.next_due) return false;
    const dueDate = new Date(plan.next_due);
    return dueDate >= today && dueDate <= futureDate;
  }).length;
};

export const getOverdueItems = (actionPlans: ActionPlanItem[]): number => {
  const today = new Date();
  return actionPlans.filter(plan => {
    if (!plan.last_done) return true;
    if (!plan.next_due) return false;
    return new Date(plan.next_due) < today;
  }).length;
};

export const getReportedIssuesCount = (actionPlans: ActionPlanItem[]): number => {
  return actionPlans.filter(plan => plan.issue).length;
};

export const getSectionOverdueCount = (actionPlans: ActionPlanItem[], section: string): number => {
  const today = new Date();
  return actionPlans.filter(plan => {
    if (plan.section !== section) return false;
    if (!plan.last_done) return true; // Overdue if never done
    if (!plan.next_due) return false;
    return new Date(plan.next_due) < today;
  }).length;
};

export const getSectionIssuesCount = (actionPlans: ActionPlanItem[], section: string): number => {
  return actionPlans.filter(plan => plan.section === section && plan.issue).length;
};
