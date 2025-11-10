import { useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { 
  PurchaseOrder, 
  Project, 
  Supplier, 
  Customer, 
  Quote 
} from '../../../types/database';
import type { ActionPlanCounts, OverdueCounts } from '../types/dashboardTypes';

interface UseDataFetchingProps {
  // Data setters
  setOrders: (orders: PurchaseOrder[]) => void;
  setProjects: (projects: Project[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  setCustomers: (customers: Customer[]) => void;
  setQuotes: (quotes: Quote[]) => void;
  setLeads: (leads: any[]) => void;
  setWorkers: (workers: any[]) => void;
  setSites: (sites: any[]) => void;
  setActionPlanCounts: (counts: ActionPlanCounts) => void;
  setOverdueCounts: (counts: Partial<OverdueCounts>) => void;
  setCompanyName: (name: string) => void;
  setCompanyPrefix: (prefix: string) => void;
  setTodaysEvents: (events: any[]) => void;
  setUpcomingEvents: (events: any[]) => void;
  setLoadingEvents: (loading: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export function useDataFetching({
  setOrders,
  setProjects,
  setSuppliers,
  setCustomers,
  setQuotes,
  setLeads,
  setWorkers,
  setSites,
  setActionPlanCounts,
  setOverdueCounts,
  setCompanyName,
  setCompanyPrefix,
  setTodaysEvents,
  setUpcomingEvents,
  setLoadingEvents,
  setLoading,
}: UseDataFetchingProps) {

  const fetchData = async () => {
    try {
      const [
        ordersResponse,
        projectsResponse,
        suppliersResponse,
        customersResponse,
        quotesResponse,
        leadsResponse,
        workersResponse,
        sitesResponse,
        staffResponse,
        tasksResponse,
        subcontractorsResponse
      ] = await Promise.all([
        supabase
          .from('purchase_orders')
          .select(`*, project:projects(name)`)
          .order('created_at', { ascending: false }),
        supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('suppliers')
          .select('*')
          .order('name', { ascending: true }),
        supabase
          .from('customers')
          .select('*')
          .order('customer_name', { ascending: true }),
        supabase
          .from('quotes')
          .select(`*, customer:customers(customer_name, company_name)`)
          .order('created_at', { ascending: false }),
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('workers')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('sites')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase.from('staff').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('subcontractors').select('*')
      ]);

      // Error checking
      if (ordersResponse.error) throw ordersResponse.error;
      if (projectsResponse.error) throw projectsResponse.error;
      if (suppliersResponse.error) throw suppliersResponse.error;
      if (customersResponse.error) throw customersResponse.error;
      if (quotesResponse.error) throw quotesResponse.error;
      if (leadsResponse.error) throw leadsResponse.error;
      if (workersResponse.error) throw workersResponse.error;
      if (sitesResponse.error) throw sitesResponse.error;
      if (staffResponse.error) throw staffResponse.error;
      if (tasksResponse.error) throw tasksResponse.error;
      if (subcontractorsResponse.error) throw subcontractorsResponse.error;

      // Set data
      setOrders(ordersResponse.data || []);
      setProjects(projectsResponse.data || []);
      setSuppliers(suppliersResponse.data || []);
      setCustomers(customersResponse.data || []);
      setQuotes(quotesResponse.data || []);
      setLeads(leadsResponse.data || []);
      setWorkers(workersResponse.data || []);
      setSites(sitesResponse.data || []);
      
      setOverdueCounts({
        totalStaff: staffResponse.data?.length || 0,
        totalTasks: tasksResponse.data?.length || 0,
        totalSubcontractors: subcontractorsResponse.data?.length || 0,
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActionPlanCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('action_plan')
        .select('next_due');

      if (error) throw error;

      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      const sixtyDaysFromNow = new Date();
      sixtyDaysFromNow.setDate(today.getDate() + 60);

      const counts = {
        actionPlan30Days: 0,
        actionPlan60Days: 0,
        actionPlanOverdue: 0
      };

      data?.forEach(plan => {
        if (!plan.next_due) return;
        const dueDate = new Date(plan.next_due);
        
        if (dueDate < today) {
          counts.actionPlanOverdue++;
        } else if (dueDate <= thirtyDaysFromNow) {
          counts.actionPlan30Days++;
        } else if (dueDate <= sixtyDaysFromNow) {
          counts.actionPlan60Days++;
        }
      });

      setActionPlanCounts(counts);
    } catch (error) {
      console.error('Error fetching action plan counts:', error);
    }
  };

  // Simplified overdue counts fetching (the full implementation would be much longer)
  const fetchOverdueCounts = async () => {
    try {
      // This is a simplified version - the full implementation would include
      // all the complex logic for drivers, vehicles, equipment, etc.
      const { data: riskAssessments, error } = await supabase
        .from('risk_assessments')
        .select('*');

      if (error) throw error;

      // Calculate overdue risk assessments
      const today = new Date();
      const overdueRiskAssessments = riskAssessments?.filter(ra => {
        if (!ra.review_date) return false;
        const reviewDate = new Date(ra.review_date);
        return reviewDate < today;
      }).length || 0;

      setOverdueCounts({
        overdueRiskAssessmentsCount: overdueRiskAssessments,
      });

    } catch (error) {
      console.error('Error fetching overdue counts:', error);
    }
  };

  const fetchCompanyName = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('name, prefix')
        .limit(1)
        .single();

      if (error) throw error;
      if (data?.name) {
        setCompanyName(data.name);
      }
      if (data?.prefix) {
        setCompanyPrefix(data.prefix);
      }
    } catch (err) {
      console.error('Error fetching company name:', err);
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      setLoadingEvents(true);
      
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get tomorrow's date (end of today)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Get 5 days from now for upcoming events
      const fiveDaysFromNow = new Date(today);
      fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
      
      // Fetch today's events
      const { data: todayData, error: todayError } = await supabase
        .from('calendar')
        .select('*')
        .gte('start_date', today.toISOString())
        .lt('start_date', tomorrow.toISOString())
        .order('start_date', { ascending: true });

      if (todayError) throw todayError;
      
      // Fetch upcoming events (from tomorrow for the next 5 days)
      const { data: upcomingData, error: upcomingError } = await supabase
        .from('calendar')
        .select('*')
        .gte('start_date', tomorrow.toISOString())
        .lte('start_date', fiveDaysFromNow.toISOString())
        .order('start_date', { ascending: true });

      if (upcomingError) throw upcomingError;
      
      setTodaysEvents(todayData || []);
      setUpcomingEvents(upcomingData || []);
      
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  return {
    fetchData,
    fetchActionPlanCounts,
    fetchOverdueCounts,
    fetchCompanyName,
    fetchCalendarEvents,
  };
}