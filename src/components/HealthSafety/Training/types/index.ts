import React from 'react';

// Core interfaces
export interface TrainingMatrixItem {
  id: string;
  name: string;
  position: string;
  created_at: string;
  user_id: string;
  staff_id?: string;
  training_records?: TrainingRecord[];
  cards_tickets?: CardTicket[];
  certificates?: Certificate[];
}

export interface Staff {
  id: string;
  name: string;
  position: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
}

export interface Worker {
  id: string;
  full_name: string;
  email: string;
  company: string;
  phone: string;
  is_active: boolean;
}

export interface CombinedStaffUser {
  id: string;
  name: string;
  type: 'staff' | 'user' | 'worker';
  original_id: string;
  email: string;
  position?: string;
  company?: string;
  phone?: string;
  is_active?: boolean;
}

export interface TrainingItem {
  id: string;
  training_name: string;
}

export interface TrainingRecord {
  training_item_id: string;
  stage: string;
  date_added: string;
  expiry_date: string;
  status: string;
}

export interface CardTicket {
  issuer: string;
  card_type: string;
  card_number: string;
  date_added: string;
  date_expires: string;
}

export interface Certificate {
  certificate_name: string;
  file: File | null;
  date_added: string;
  date_expires: string;
  file_path: string;
}

export interface FilePreview {
  id: string;
  name: string;
  url: string;
  file: File | null;
  isExisting: boolean;
}

// Component Props
export interface TrainingMatrixProps {
  onBack: () => void;
}

export interface TrainingFormProps {
  onClose: () => void;
  editData?: TrainingMatrixItem;
}

export interface TrainingTableProps {
  trainingData: TrainingMatrixItem[];
  filteredData: TrainingMatrixItem[];
  loading: boolean;
  onEdit: (training: TrainingMatrixItem) => void;
  onView: (training: TrainingMatrixItem) => void;
  onDelete: (trainingId: string, trainingName: string) => void;
}

export interface TrainingCardProps {
  training: TrainingMatrixItem;
  onEdit: (training: TrainingMatrixItem) => void;
  onView: (training: TrainingMatrixItem) => void;
  onDelete: (trainingId: string, trainingName: string) => void;
}

export interface TrainingSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddTraining: () => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  trainingToDelete: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ViewTrainingModalProps {
  isOpen: boolean;
  selectedTraining: TrainingMatrixItem | null;
  certificateUrls: {[key: string]: string};
  onClose: () => void;
}



export interface FormStepProps {
  selectedStaff?: string;
  setSelectedStaff?: (staff: string) => void;
  combinedStaffUsers?: CombinedStaffUser[];
  trainingRecords?: TrainingRecord[];
  setTrainingRecords?: React.Dispatch<React.SetStateAction<TrainingRecord[]>>;
  cardTickets?: CardTicket[];
  setCardTickets?: React.Dispatch<React.SetStateAction<CardTicket[]>>;
  certificates?: Certificate[];
  setCertificates?: React.Dispatch<React.SetStateAction<Certificate[]>>;
  expandedTrainingItems?: number[];
  setExpandedTrainingItems?: React.Dispatch<React.SetStateAction<number[]>>;
  expandedCards?: number[];
  setExpandedCards?: React.Dispatch<React.SetStateAction<number[]>>;
  filePreviews?: FilePreview[];
  setFilePreviews?: React.Dispatch<React.SetStateAction<FilePreview[]>>;
  allTrainingItems?: TrainingItem[];
  editData?: TrainingMatrixItem;
}

// Due Date interface
export interface DueDate {
  type: string;
  name: string;
  expiry: string;
}

// Error and Success message props
export interface ErrorMessageProps {
  error: string;
  variant?: 'default' | 'modal';
}

export interface SuccessMessageProps {
  message: string;
}