
import type { CalendarEvent, ViewType } from '../types';
import { isDateInPast } from '../utils';

interface UseDragAndDropProps {
  draggedEvent: CalendarEvent | null;
  setDraggedEvent: (event: CalendarEvent | null) => void;
  dragOverDate: Date | null;
  setDragOverDate: (date: Date | null) => void;
  updateEvent: (eventId: string, eventData: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  view: ViewType;
}

export const useDragAndDrop = ({
  draggedEvent,
  setDraggedEvent,
  dragOverDate,
  setDragOverDate,
  updateEvent,
  view
}: UseDragAndDropProps) => {
  
  const handleDragStart = (e: DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event);
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', event.id);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.6';
      e.currentTarget.style.transform = 'scale(0.95)';
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    setDraggedEvent(null);
    setDragOverDate(null);
    
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  const handleDragOver = (e: DragEvent, targetDate: Date) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
    setDragOverDate(targetDate);
  };

  const handleDragLeave = (e: DragEvent) => {
    // Only clear drag over if we're actually leaving the drop zone
    if (!(e.currentTarget as Element).contains(e.relatedTarget as Node)) {
      setDragOverDate(null);
    }
  };

  const handleDrop = async (e: DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDragOverDate(null);

    if (!draggedEvent) return;
    
    // Prevent dropping events on past dates
    if (isDateInPast(targetDate)) {
      return;
    }

    try {
      let newStart: Date;
      let newEnd: Date;

      if (view === 'month' || view === 'agenda') {
        // For month/agenda view: only change the date, keep the same time
        const originalDate = new Date(draggedEvent.start);
        const timeDiff = targetDate.getTime() - new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate()).getTime();
        
        newStart = new Date(draggedEvent.start.getTime() + timeDiff);
        newEnd = new Date(draggedEvent.end.getTime() + timeDiff);
      } else {
        // For week/day view: change both date and time to the dropped time slot
        const eventDuration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
        
        newStart = new Date(targetDate);
        newEnd = new Date(targetDate.getTime() + eventDuration);
      }

      // Update the event with new dates
      await updateEvent(draggedEvent.id, {
        ...draggedEvent,
        start: newStart,
        end: newEnd
      });

      console.log(`Moved event "${draggedEvent.title}" to ${newStart.toLocaleString()}`);
    } catch (error) {
      console.error('Error moving event:', error);
    } finally {
      setDraggedEvent(null);
    }
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
