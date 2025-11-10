import { useState } from 'react';
import type { 
  PurchaseOrder, 
  Project, 
  Supplier, 
  Customer, 
  Quote 
} from '../../../types/database';
import type { 
  CalendarEvent, 
  CalendarCategory, 
  ActionPlanCounts, 
  OverdueCounts 
} from '../types/dashboardTypes';

export function useDataStates() {
  // Core business data
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);

  // Company and user data
  const [companyName, setCompanyName] = useState('ON POINT GROUNDWORK');
  const [companyPrefix, setCompanyPrefix] = useState('');
  const [selectedName, setSelectedName] = useState('');

  // Calendar data
  const [todaysEvents, setTodaysEvents] = useState<CalendarEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [calendarCategories, setCalendarCategories] = useState<CalendarCategory[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Action plan and overdue counts
  const [actionPlanCounts, setActionPlanCounts] = useState<ActionPlanCounts>({
    actionPlan30Days: 0,
    actionPlan60Days: 0,
    actionPlanOverdue: 0
  });

  const [overdueCounts, setOverdueCounts] = useState<OverdueCounts>({
    overdueDriversCount: 0,
    overdueVehiclesCount: 0,
    overdueEquipmentChecklistsCount: 0,
    overdueVehicleChecklistsCount: 0,
    overdueRiskAssessmentsCount: 0,
    dseStatus: 0,
    totalStaff: 0,
    totalTasks: 0,
    totalSubcontractors: 0,
    totalTrainingMatrixRecords: 0,
  });

  // Licenses modal data
  const [licensesContent, setLicensesContent] = useState<string>('');
  const [loadingLicenses, setLoadingLicenses] = useState(false);

  return {
    // Core business data
    orders,
    setOrders,
    projects,
    setProjects,
    suppliers,
    setSuppliers,
    customers,
    setCustomers,
    quotes,
    setQuotes,
    leads,
    setLeads,
    workers,
    setWorkers,
    sites,
    setSites,

    // Company and user data
    companyName,
    setCompanyName,
    companyPrefix,
    setCompanyPrefix,
    selectedName,
    setSelectedName,

    // Calendar data
    todaysEvents,
    setTodaysEvents,
    upcomingEvents,
    setUpcomingEvents,
    calendarCategories,
    setCalendarCategories,
    loadingEvents,
    setLoadingEvents,

    // Counts and statistics
    actionPlanCounts,
    setActionPlanCounts,
    overdueCounts,
    setOverdueCounts,

    // Licenses data
    licensesContent,
    setLicensesContent,
    loadingLicenses,
    setLoadingLicenses,
  };
}