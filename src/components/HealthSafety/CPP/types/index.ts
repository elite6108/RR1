import type { CPP } from '../../../../types/database';

export interface CPPsubpageProps {
  onBack: () => void;
  setShowCPP: (show: boolean) => void;
}

export interface CPPTableProps {
  cpps: CPP[];
  filteredCPPs: CPP[];
  loading: boolean;
  generatingPdfId: string | null;
  onEdit: (cpp: CPP) => void;
  onViewPDF: (cpp: CPP) => void;
  onDelete: (cpp: CPP) => void;
}

export interface CPPCardProps {
  cpps: CPP[];
  filteredCPPs: CPP[];
  generatingPdfId: string | null;
  onEdit: (cpp: CPP) => void;
  onViewPDF: (cpp: CPP) => void;
  onDelete: (cpp: CPP) => void;
}

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export interface CPPHeaderProps {
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddCPP: () => void;
}

export interface CPPListProps {
  cpps: CPP[];
  loading: boolean;
  error: string | null;
  pdfError: string | null;
  searchQuery: string;
  generatingPdfId: string | null;
  onEdit: (cpp: CPP) => void;
  onViewPDF: (cpp: CPP) => void;
  onDelete: (cpp: CPP) => void;
}
