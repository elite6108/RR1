export interface HSAccidentsAnnualStatsProps {
  onBack: () => void;
}

export interface HSAccidentsStatisticsProps {
  onBack: () => void;
}

export type ViewType = 'pie' | 'line' | 'bar' | 'table';
export type PeriodType = 'calendar' | 'fiscal' | 'rolling';
export type StatsPeriodType = 'day' | 'week' | 'month' | 'custom';

export interface ChartData {
  type: string;
  count: number;
}

export interface ChartPosition {
  x: number;
  y: number;
}

export interface DragState {
  isDragging: boolean;
  dragStart: ChartPosition;
}
