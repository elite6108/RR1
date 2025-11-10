export interface Employee {
  id: string;
  name: string;
  title: string;
  children: Employee[];
  reportsTo: string[];
  user_id: string;
}

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HSOrganisationChartProps {
  onBack: () => void;
}

export type MemberType = 'Director' | 'Employee';

export type PositionType = 'Employee' | 'Manager' | 'Supervisor' | 'Team Lead' | 'Director';
