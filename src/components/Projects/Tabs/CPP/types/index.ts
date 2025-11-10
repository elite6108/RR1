import type { Project } from '../../../../../types/database';

export interface CPPFrontCover {
  projectId?: string;
  projectName?: string;
  clientName?: string;
  siteAddress?: string;
  principalContractor?: string;
  hsPersonnel?: string;
  startDate?: string;
  endDate?: string;
}

export interface CPP {
  id: string;
  created_at: string;
  updated_at?: string;
  cpp_number?: string;
  front_cover?: CPPFrontCover;
  [key: string]: any; // Allow for any additional properties
}

export interface CppTabProps {
  project: Project;
  cpps: CPP[];
  isLoading: boolean;
  onCppChange?: () => void;
}

export interface PDFWindowConfig {
  cpp: CPP;
  companySettings: any;
  formattedFilename: string;
  pdfDataUrl: string;
}

export interface PDFGenerationState {
  generatingPDF: boolean;
  pdfError: string | null;
  processingCppId: string | null;
}

export interface SearchState {
  searchQuery: string;
}

export interface CPPTableProps {
  cpps: CPP[];
  searchQuery: string;
  generatingPDF: boolean;
  processingCppId: string | null;
  onViewPDF: (cpp: CPP) => void;
  onSearchChange: (query: string) => void;
}

export interface CPPListProps {
  cpps: CPP[];
  generatingPDF: boolean;
  processingCppId: string | null;
  onViewPDF: (cpp: CPP) => void;
}

export interface CPPCardProps {
  cpp: CPP;
  generatingPDF: boolean;
  processingCppId: string | null;
  onViewPDF: (cpp: CPP) => void;
}
