declare module 'wx-react-gantt' {
  import { ReactNode, ComponentType, Ref, RefObject } from 'react';

  export interface Task {
    id: number | string;
    text: string;
    start: Date;
    end: Date;
    duration?: number;
    progress?: number;
    type?: 'task' | 'milestone' | 'summary';
    parent?: number | string;
    lazy?: boolean;
    data?: Task[];
  }

  export interface Link {
    id: number | string;
    source: number | string;
    target: number | string;
    type: string;
  }

  export interface Scale {
    unit: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    step: number;
    format: string;
    css?: (date: Date) => string;
  }

  export interface Column {
    id: string;
    header: string;
    width?: number;
    flexgrow?: number;
    align?: 'left' | 'center' | 'right';
  }

  export interface GanttProps {
    tasks: Task[];
    links?: Link[];
    scales?: Scale[];
    columns?: Column[] | false;
    apiRef?: any;
    zoom?: boolean;
    cellWidth?: number;
    cellHeight?: number;
    lengthUnit?: 'hour' | 'day' | 'week' | 'month' | 'quarter';
    start?: Date;
    end?: Date;
    scaleHeight?: number;
    editorShape?: any[];
  }

  export interface FullscreenProps {
    children: ReactNode;
    hotkey?: string;
  }

  export const Gantt: ComponentType<GanttProps>;
  export const Fullscreen: ComponentType<FullscreenProps>;
  export const ContextMenu: ComponentType<any>;
  export const Willow: ComponentType<any>;
  export const WillowDark: ComponentType<any>;
  export const defaultEditorShape: any[];
}
