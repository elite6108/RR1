export interface CoshhMSDS {
  id: string;
  substance_name: string;
  manufacturer: string;
  file_name: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  uploaded_by: string;
  coshh_register_id?: string;
  created_at: string;
}

export interface CoshhRegisterItem {
  id: string;
  substance_name: string;
  manufacturer: string;
}

export interface MSDSSafetySheetsProps {
  onBack: () => void;
}

export interface SafetySheetsFormData {
  substance_name: string;
  manufacturer: string;
  coshh_register_id: string;
}

export interface SafetySheetsModalState {
  showUploadModal: boolean;
  showDeleteModal: boolean;
  selectedSheetForDelete: CoshhMSDS | null;
  deleting: boolean;
  uploading: boolean;
  selectedFile: File | null;
  dragOver: boolean;
}

export interface SafetySheetsSearchState {
  searchTerm: string;
  filteredSheets: CoshhMSDS[];
}
