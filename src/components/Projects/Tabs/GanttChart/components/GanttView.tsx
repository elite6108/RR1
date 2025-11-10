import React, { useMemo } from 'react';
import { Gantt, Willow } from 'wx-react-gantt';
import type { GanttTask, GanttLink } from '../types';
import { ganttColumns, ganttScales, dayStyle } from '../utils/constants';

interface GanttViewProps {
  apiRef: React.MutableRefObject<any>;
  tasks: GanttTask[];
  links: GanttLink[];
  onInit: (api: any) => void;
}

export function GanttView({ apiRef, tasks, links, onInit }: GanttViewProps) {
  // Convert tasks to the format expected by the Gantt component
  // Use useMemo to prevent unnecessary re-renders
  const ganttTasks = useMemo(() => 
    tasks.map(task => ({
      ...task,
      parent: task.parent || undefined // Convert null to undefined
    })), [tasks]
  );

  return (
    <div className="hidden lg:block">
      <p style={{ margin: 0 }}><strong>Tip:</strong> For the best experience, view this page in landscape mode using a tablet or a desktop computer.</p>
      <p style={{ margin: 0 }}>To zoom the timeline, hold <strong>Ctrl</strong> (or <strong>⌘ Command</strong> on Mac) and scroll with your mouse wheel whilst over the timeline.</p>
      <p style={{ margin: 0 }}>To export the Gantt chart, scroll to required zoom, and then click the <strong>Export to PDF</strong> button.</p>
      <br></br>
      <div className="demo-rows w-full h-full relative">
        <Willow>
          <Gantt
            apiRef={apiRef}
            tasks={ganttTasks as any}
            links={links}
            scales={ganttScales}
            zoom={true}
            columns={ganttColumns}
            init={onInit}
            dayStyle={dayStyle}
            readonly={true}
          />
        </Willow>
      </div>
    </div>
  );
}
