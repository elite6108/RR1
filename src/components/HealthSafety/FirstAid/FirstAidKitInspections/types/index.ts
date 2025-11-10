// Re-export types from database.ts for consistency
export type { FirstAidKit, FirstAidKitItem, FirstAidKitInspection } from '../../../../../types/database';

export interface FirstAidKitInspectionsProps {
  onBack: () => void;
  onOverdueInspectionsChange?: (count: number) => void;
}
