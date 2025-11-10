import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { CompanyFile, Breadcrumb } from '../types';

export const useFiles = (currentFolder: string | null) => {
  const [companyFiles, setCompanyFiles] = useState<CompanyFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('company_files')
        .select('*');
      
      if (currentFolder) {
        query = query.eq('parent_folder_id', currentFolder);
      } else {
        query = query.is('parent_folder_id', null);
      }
      
      const { data, error } = await query
        .order('is_folder', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      setCompanyFiles(data || []);
      
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

  const updateBreadcrumbs = async (folderId: string) => {
    const crumbs: Breadcrumb[] = [];
    let currentId: string | null = folderId;
    
    while (currentId) {
      const { data } = await supabase
        .from('company_files')
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

  const createFolder = async (folderName: string, parentFolderId: string | null) => {
    if (!folderName.trim()) return false;

    try {
      const folderId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('company_files')
        .insert({
          id: folderId,
          name: folderName.trim(),
          file_path: '',
          is_folder: true,
          parent_folder_id: parentFolderId
        });

      if (error) throw error;
      await fetchFiles();
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      return false;
    }
  };

  const deleteFiles = async (fileIds: string[]) => {
    try {
      setLoading(true);
      
      const filesInfo = await supabase.from('company_files').select('id, storage_path, is_folder').in('id', fileIds);
      if (filesInfo.error) throw filesInfo.error;

      const toDelete = filesInfo.data;
      const filePaths = toDelete.filter(f => !f.is_folder && f.storage_path).map(f => f.storage_path);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from('company-files').remove(filePaths);
        if (storageError) console.warn('Partial delete: could not remove some files from storage', storageError);
      }
      
      const { error: dbError } = await supabase.from('company_files').delete().in('id', fileIds);
      if (dbError) throw dbError;

      await fetchFiles();
      return true;
    } catch (error) {
      console.error('Error deleting files:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const moveFile = async (fileId: string, targetFolderId: string | null) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('company_files')
        .update({ parent_folder_id: targetFolderId || null })
        .eq('id', fileId);

      if (error) throw error;
      await fetchFiles();
      return true;
    } catch (error) {
      console.error('Error moving item:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFileName = async (fileId: string, newName: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('company_files')
        .update({ name: newName })
        .eq('id', fileId);

      if (error) throw error;
      await fetchFiles();
      return true;
    } catch (error) {
      console.error('Error updating item name:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentFolder]);

  return {
    companyFiles,
    loading,
    breadcrumbs,
    fetchFiles,
    createFolder,
    deleteFiles,
    moveFile,
    updateFileName
  };
};
