export interface CompanyFile {
  id: string;
  name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  is_folder: boolean;
  parent_folder_id?: string;
  storage_path?: string;
  created_at: string;
  is_employee_handbook?: boolean;
  is_annual_training?: boolean;
}

export interface FilesProps {
  onBack: () => void;
}

export type ViewMode = 'list' | 'grid';

export interface FolderTreeItemProps {
  folder: CompanyFile | null;
  currentFolder: string | null;
  onFolderClick: (folderId: string | null) => void;
  level: number;
  allFolders: CompanyFile[];
  onMobileClose?: () => void;
}

export interface FileIconProps {
  file: CompanyFile;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ImageThumbnailProps {
  file: CompanyFile;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface AssignmentAction {
  type: 'assign' | 'remove';
  category: 'handbook' | 'annual_training';
  file: CompanyFile;
}

export interface UploadProgress {
  [key: string]: number;
}

export interface Breadcrumb {
  id: string;
  name: string;
}
