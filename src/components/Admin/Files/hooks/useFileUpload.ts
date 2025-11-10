import { useState, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { generateStoragePath } from '../utils/helpers';
import { UPLOAD_PROGRESS_STEPS } from '../utils/constants';
import type { UploadProgress } from '../types';

export const useFileUpload = (currentFolder: string | null, onUploadComplete: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isDragOverUpload, setIsDragOverUpload] = useState(false);
  const [isDragOverMainPane, setIsDragOverMainPane] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const fileArray = Array.from(files);
    const progressMap: UploadProgress = {};
    
    // Initialize progress for all files
    fileArray.forEach((file, index) => {
      progressMap[`${file.name}-${index}`] = 0;
    });
    setUploadProgress(progressMap);

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const fileKey = `${file.name}-${i}`;
        const fileId = crypto.randomUUID();
        const storagePath = generateStoragePath(file.name);
        
        // Update progress to 25% when starting upload
        setUploadProgress(prev => ({ ...prev, [fileKey]: UPLOAD_PROGRESS_STEPS.START }));
        
        const { error: uploadError } = await supabase.storage
          .from('company-files')
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        // Update progress to 75% when upload complete
        setUploadProgress(prev => ({ ...prev, [fileKey]: UPLOAD_PROGRESS_STEPS.UPLOADED }));

        const { error: dbError } = await supabase
          .from('company_files')
          .insert({
            id: fileId,
            name: file.name,
            file_path: storagePath,
            file_size: file.size,
            mime_type: file.type,
            is_folder: false,
            parent_folder_id: currentFolder,
            storage_path: storagePath
          });

        if (dbError) throw dbError;

        // Update progress to 100% when database insert complete
        setUploadProgress(prev => ({ ...prev, [fileKey]: UPLOAD_PROGRESS_STEPS.COMPLETE }));
      }

      onUploadComplete();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      // Clear progress after a delay
      setTimeout(() => setUploadProgress({}), 1000);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  // Drag and drop handlers for upload modal
  const handleUploadDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverUpload(true);
  };

  const handleUploadDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOverUpload(false);
    }
  };

  const handleUploadDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverUpload(true);
  };

  const handleUploadDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverUpload(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Drag and drop handlers for main pane
  const handleMainPaneDragEnter = (e: React.DragEvent, draggedItem: any) => {
    e.preventDefault();
    e.stopPropagation();
    // Only handle external files, not internal drag operations
    if (!draggedItem && e.dataTransfer.types.includes('Files')) {
      setIsDragOverMainPane(true);
    }
  };

  const handleMainPaneDragLeave = (e: React.DragEvent, draggedItem: any) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the main pane completely
    if (!draggedItem) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
        setIsDragOverMainPane(false);
      }
    }
  };

  const handleMainPaneDragOver = (e: React.DragEvent, draggedItem: any) => {
    e.preventDefault();
    e.stopPropagation();
    // Only handle external files, not internal drag operations
    if (!draggedItem && e.dataTransfer.types.includes('Files')) {
      setIsDragOverMainPane(true);
    }
  };

  const handleMainPaneDrop = (e: React.DragEvent, draggedItem: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverMainPane(false);
    
    // Only handle external files, not internal drag operations
    if (!draggedItem && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      handleFileUpload(files);
    }
  };

  return {
    isUploading,
    uploadProgress,
    isDragOverUpload,
    isDragOverMainPane,
    fileInputRef,
    handleFileUpload,
    handleFileInputChange,
    handleUploadDragEnter,
    handleUploadDragLeave,
    handleUploadDragOver,
    handleUploadDrop,
    handleMainPaneDragEnter,
    handleMainPaneDragLeave,
    handleMainPaneDragOver,
    handleMainPaneDrop
  };
};
