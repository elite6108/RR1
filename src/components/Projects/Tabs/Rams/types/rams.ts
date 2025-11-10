import type { RAMS } from '../../../../../types/database';
import type { Project } from '../../../../../types/task';

// Re-export the RAMS type from database for consistency
export type { RAMS };

export interface RamsTabProps {
  project: Project;
  rams: RAMS[];
  isLoading: boolean;
  onRamsChange?: () => void;
}
