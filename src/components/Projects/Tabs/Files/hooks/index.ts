import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { ProjectFile, Breadcrumb } from '../types';
import { validateMove } from '../utils';

export const useFileOperations = (projectId: string, onFilesChange: () => void) => {
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [allFolders, setAllFolders] = useState<ProjectFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId);
      
      // Handle NULL parent_folder_id properly
      if (currentFolder) {
        query = query.eq('parent_folder_id', currentFolder);
      } else {
        query = query.is('parent_folder_id', null);
      }
      
      const { data, error } = await query
        .order('is_folder', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      setProjectFiles(data || []);
      
      // Update breadcrumbs
      if (currentFolder) {
        await updateBreadcrumbs(currentFolder);
      } else {
        setBreadcrumbs([]);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_folder', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setAllFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const updateBreadcrumbs = async (folderId: string) => {
    const crumbs = [];
    let currentId = folderId;
    
    while (currentId) {
      const { data } = await supabase
        .from('project_files')
        .select('id, name, parent_folder_id')
        .eq('id', currentId)
        .single();
      
      if (data) {
        crumbs.unshift({ id: data.id, name: data.name });
        currentId = data.parent_folder_id;
      } else {
        break;
      }
    }
    
    setBreadcrumbs(crumbs);
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setLoading(true);
    
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/${currentFolder || 'root'}/${Date.now()}_${file.name}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Save file metadata to database
        const { error: dbError } = await supabase
          .from('project_files')
          .insert({
            project_id: projectId,
            name: file.name,
            file_path: fileName,
            file_size: file.size,
            mime_type: file.type,
            is_folder: false,
            parent_folder_id: currentFolder,
            storage_path: uploadData.path
          });

        if (dbError) throw dbError;
      }
      
      await fetchFiles();
      onFilesChange();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const createFolder = async (folderName: string) => {
    if (!folderName.trim()) return;

    try {
      const { error } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          name: folderName.trim(),
          file_path: `${currentFolder || 'root'}/${folderName.trim()}`,
          is_folder: true,
          parent_folder_id: currentFolder
        });

      if (error) throw error;
      
      await fetchFiles();
      await fetchAllFolders();
      onFilesChange();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const deleteFiles = async (fileIds: Set<string>) => {
    if (fileIds.size === 0) return;
    
    try {
      setLoading(true);
      
      for (const fileId of fileIds) {
        const file = projectFiles.find(f => f.id === fileId);
        if (!file) continue;

        // Delete from storage if it's a file
        if (!file.is_folder && file.storage_path) {
          await supabase.storage
            .from('project-files')
            .remove([file.storage_path]);
        }

        // Delete from database
        await supabase
          .from('project_files')
          .delete()
          .eq('id', fileId);
      }
      
      await fetchFiles();
      await fetchAllFolders();
      onFilesChange();
    } catch (error) {
      console.error('Error deleting files:', error);
    } finally {
      setLoading(false);
    }
  };

  const moveFile = async (draggedItem: ProjectFile, targetFolderId: string | null) => {
    // Validate the move
    if (!validateMove(draggedItem, targetFolderId, allFolders)) {
      console.log('Invalid move operation');
      return false;
    }

    try {
      setLoading(true);
      
      // Update the database
      const { error } = await supabase
        .from('project_files')
        .update({ 
          parent_folder_id: targetFolderId 
        })
        .eq('id', draggedItem.id);

      if (error) {
        console.error('Error moving file:', error);
        return false;
      }

      // Refresh the file list
      await fetchFiles();
      await fetchAllFolders();
      onFilesChange();
      
      console.log(`Moved ${draggedItem.name} to folder ${targetFolderId || 'root'}`);
      return true;
    } catch (error) {
      console.error('Error moving file:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFileName = async (fileId: string, newName: string) => {
    if (!newName.trim()) return false;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('project_files')
        .update({ name: newName.trim() })
        .eq('id', fileId);

      if (error) throw error;
      
      await fetchFiles();
      await fetchAllFolders();
      onFilesChange();
      return true;
    } catch (error) {
      console.error('Error updating name:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
  };

  useEffect(() => {
    fetchFiles();
    fetchAllFolders();
  }, [projectId, currentFolder]);

  return {
    // State
    projectFiles,
    allFolders,
    currentFolder,
    loading,
    breadcrumbs,
    fileInputRef,
    
    // Actions
    handleFileUpload,
    createFolder,
    deleteFiles,
    moveFile,
    updateFileName,
    goToFolder,
    fetchFiles,
    fetchAllFolders
  };
};

export const useFilePreview = () => {
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const openFileModal = async (file: ProjectFile) => {
    setSelectedFile(file);
    setShowFileModal(true);
    setFilePreviewUrl(null); // Reset preview URL
    
    console.log('Opening file modal for:', file.name, 'Storage path:', file.storage_path, 'MIME type:', file.mime_type);
    
    // Generate signed URL for private storage
    if (file.storage_path) {
      try {
        console.log('Generating signed URL for:', file.storage_path);
        const { data, error } = await supabase.storage
          .from('project-files')
          .createSignedUrl(file.storage_path, 3600); // 1 hour expiry
        
        if (error) {
          console.error('Error creating signed URL:', error);
          setFilePreviewUrl(null);
        } else if (data?.signedUrl) {
          console.log('Successfully generated signed URL:', data.signedUrl);
          setFilePreviewUrl(data.signedUrl);
        } else {
          console.error('No signed URL returned:', data);
          setFilePreviewUrl(null);
        }
      } catch (error) {
        console.error('Exception generating preview URL:', error);
        setFilePreviewUrl(null);
      }
    } else {
      console.log('No storage path found for file');
      setFilePreviewUrl(null);
    }
  };

  const closeFileModal = () => {
    setShowFileModal(false);
    setFilePreviewUrl(null);
    setSelectedFile(null);
  };

  const downloadFile = async (file: ProjectFile) => {
    if (!file.storage_path) {
      console.error('No storage path for download');
      return;
    }
    
    try {
      console.log('Downloading file:', file.name);
      const { data, error } = await supabase.storage
        .from('project-files')
        .createSignedUrl(file.storage_path, 60); // 1 minute expiry for download
      
      if (error) {
        console.error('Error creating download URL:', error);
        return;
      }
      
      if (data?.signedUrl) {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = file.name;
        link.target = '_blank'; // Open in new tab as fallback
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('Download initiated for:', file.name);
      } else {
        console.error('No download URL returned');
      }
    } catch (error) {
      console.error('Exception downloading file:', error);
    }
  };

  return {
    showFileModal,
    selectedFile,
    filePreviewUrl,
    openFileModal,
    closeFileModal,
    downloadFile
  };
};
