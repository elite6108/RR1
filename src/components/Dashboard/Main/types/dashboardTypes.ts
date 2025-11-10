export interface DashboardProps {
  selectedProjectId: string | null;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  calendar_id: string;
  location?: string;
  notes?: string;
}

export interface CalendarCategory {
  id: string;
  name: string;
  color: string;
}

export interface ModulesConfig {
  admin: boolean;
  customersAndProjects: boolean;
  purchaseOrders: boolean;
  quotes: boolean;
  healthAndSafety: boolean;
  training: boolean;
  reporting: boolean;
}

export interface ExpandedSections {
  quickActions: boolean;
  admin: boolean;
  customersAndProjects: boolean;
  purchaseOrders: boolean;
  quotes: boolean;
  healthAndSafety: boolean;
  training: boolean;
  reporting: boolean;
}

export interface ActionPlanCounts {
  actionPlan30Days: number;
  actionPlan60Days: number;
  actionPlanOverdue: number;
}

export interface OverdueCounts {
  overdueDriversCount: number;
  overdueVehiclesCount: number;
  overdueEquipmentChecklistsCount: number;
  overdueVehicleChecklistsCount: number;
  overdueRiskAssessmentsCount: number;
  dseStatus: number;
  totalStaff: number;
  totalTasks: number;
  totalSubcontractors: number;
  totalTrainingMatrixRecords: number;
}

export type ConnectionStatus = 'checking' | 'connected' | 'error';

export type ActiveSection = string | null;