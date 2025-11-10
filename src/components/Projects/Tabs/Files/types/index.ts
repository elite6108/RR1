export interface ProjectFile {
  id: string;
  name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  is_folder: boolean;
  parent_folder_id?: string;
  storage_path?: string;
  created_at: string;
}

export interface FilesTabProps {
  project: {
    id: string;
    name: string;
  };
  files: any[];
  isLoading: boolean;
  onFilesChange: () => void;
}

export type ViewMode = 'list' | 'grid';

export interface FolderTreeItemProps {
  folder: ProjectFile | null;
  currentFolder: string | null;
  onFolderClick: (folderId: string | null) => void;
  level: number;
  allFolders: ProjectFile[];
  onMobileClose?: () => void;
}

export interface ImageThumbnailProps {
  file: ProjectFile;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export type FileTypeCategory = 'image' | 'pdf' | 'document' | 'spreadsheet' | 'presentation' | 'text' | 'other' | 'unknown';

export interface Breadcrumb {
  id: string;
  name: string;
}
