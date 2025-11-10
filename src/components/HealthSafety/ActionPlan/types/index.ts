export interface ActionPlanProps {
  setShowActionPlan: (show: boolean) => void;
  setActiveSection: (section: string) => void;
  onShowReportingDashboard?: () => void;
}

export interface ActionPlanItem {
  id: string;
  section: string;
  item: string;
  description: string;
  type: string;
  serials: string;
  notes: string;
  last_done: string | null;
  interval_months: string;
  next_due: string | null;
  created_at: string;
  issue: boolean;
  files?: string[];
}

export interface FilePreview {
  id: string;
  name: string;
  url: string;
  file?: File;
  isExisting: boolean;
}

export interface AddEditModalProps {
  isOpen: boolean;
  isEditing: boolean;
  editingId: string | null;
  actionPlan: Partial<ActionPlanItem>;
  onClose: () => void;
  onSave: (id?: string) => void;
  onActionPlanChange: (actionPlan: Partial<ActionPlanItem>) => void;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  filePreviews: FilePreview[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
  uploadingFiles: boolean;
}

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface StatisticsWidgetsProps {
  actionPlans: ActionPlanItem[];
}

export interface SectionListProps {
  sections: string[];
  actionPlans: ActionPlanItem[];
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  onAddItem: (section: string) => void;
  onEditItem: (plan: ActionPlanItem) => void;
  onDeleteItem: (id: string) => void;
}
