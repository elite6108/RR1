import { supabase } from '../../../../lib/supabase';
import { BaseDocument, UploadConfig } from '../types';
import { generateUniqueFileName } from './fileValidation';

/**
 * Fetches signed URLs for thumbnail images
 * @param documents - Array of documents with potential thumbnail paths
 * @returns Record mapping document IDs to signed URLs
 */
export const fetchThumbnailUrls = async <T extends BaseDocument>(
  documents: T[]
): Promise<Record<string, string>> => {
  const urlMap: Record<string, string> = {};
  
  for (const doc of documents) {
    if (doc.thumbnail_path) {
      try {
        const { data, error } = await supabase.storage
          .from('guidance-images')
          .createSignedUrl(doc.thumbnail_path, 3600); // 1 hour expiry

        if (data && !error) {
          urlMap[doc.id] = data.signedUrl;
        }
      } catch (error) {
        console.error(`Error fetching thumbnail URL for document ${doc.id}:`, error);
      }
    }
  }
  
  return urlMap;
};

/**
 * Creates a signed URL for viewing a PDF document
 * @param filePath - Path to the PDF file in storage
 * @param bucketName - Name of the storage bucket
 * @returns Signed URL for the PDF
 */
export const createPdfSignedUrl = async (
  filePath: string, 
  bucketName: string
): Promise<string> => {
  console.log('Creating signed URL for:', { filePath, bucketName });
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  console.log('Supabase response:', { data, error });

  if (error) {
    console.error('Supabase storage error:', error);
    throw error;
  }
  
  if (!data || !data.signedUrl) {
    console.error('No signed URL returned from Supabase');
    throw new Error('Failed to create signed URL');
  }

  return data.signedUrl;
};

/**
 * Uploads a document with PDF and optional thumbnail
 * @param config - Upload configuration
 * @param title - Document title
 * @param pdfFile - PDF file to upload
 * @param thumbnailFile - Optional thumbnail file
 * @returns Promise that resolves when upload is complete
 */
export const uploadDocument = async (
  config: UploadConfig,
  title: string,
  pdfFile: File,
  thumbnailFile: File | null
): Promise<void> => {
  // Upload PDF to specified bucket
  const pdfFileName = generateUniqueFileName(pdfFile.name);
  const { error: pdfError } = await supabase.storage
    .from(config.pdfBucket)
    .upload(pdfFileName, pdfFile);
  
  if (pdfError) throw pdfError;

  // Upload thumbnail to private guidance-images bucket if provided
  let thumbnailPath = null;
  if (thumbnailFile) {
    const thumbnailFileName = generateUniqueFileName(thumbnailFile.name);
    const { error: thumbnailError } = await supabase.storage
      .from(config.thumbnailBucket)
      .upload(thumbnailFileName, thumbnailFile);
    
    if (thumbnailError) throw thumbnailError;
    thumbnailPath = thumbnailFileName;
  }

  // Create database record
  const { error: dbError } = await supabase
    .from(config.tableName)
    .insert([{
      title,
      file_path: pdfFileName,
      thumbnail_path: thumbnailPath,
    }]);

  if (dbError) throw dbError;
};

/**
 * Fetches documents from a specified table
 * @param tableName - Name of the database table
 * @returns Array of documents
 */
export const fetchDocuments = async <T extends BaseDocument>(
  tableName: string
): Promise<T[]> => {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('title', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Fetches document count from a specified table
 * @param tableName - Name of the database table
 * @returns Number of documents in the table
 */
export const fetchDocumentCount = async (tableName: string): Promise<number> => {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
};

/**
 * Checks if a file exists in a storage bucket
 * @param bucketName - Name of the storage bucket
 * @param filePath - Path to the file
 * @returns Boolean indicating if file exists
 */
export const checkFileExists = async (
  bucketName: string, 
  filePath: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { 
        limit: 1,
        search: filePath
      });

    if (error) {
      console.error('Error checking file existence:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
};

/**
 * Lists all files in a storage bucket (for debugging)
 * @param bucketName - Name of the storage bucket
 * @returns Array of file objects
 */
export const listBucketFiles = async (bucketName: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error(`Error listing files in bucket ${bucketName}:`, error);
      return [];
    }

    console.log(`Files in bucket ${bucketName}:`, data);
    return data || [];
  } catch (error) {
    console.error(`Error listing files in bucket ${bucketName}:`, error);
    return [];
  }
};

/**
 * Updates a document with new PDF and/or thumbnail
 * @param config - Upload configuration
 * @param id - Document ID to update
 * @param title - New document title
 * @param pdfFile - Optional new PDF file
 * @param thumbnailFile - Optional new thumbnail file
 * @param currentDocument - Current document data for cleanup
 * @returns Promise that resolves when update is complete
 */
export const updateDocument = async (
  config: UploadConfig,
  id: string,
  title: string,
  pdfFile: File | null,
  thumbnailFile: File | null,
  currentDocument: BaseDocument
): Promise<void> => {
  let pdfPath = currentDocument.file_path;
  let thumbnailPath = currentDocument.thumbnail_path;

  // Upload new PDF if provided
  if (pdfFile) {
    const newPdfFileName = generateUniqueFileName(pdfFile.name);
    const { error: pdfError } = await supabase.storage
      .from(config.pdfBucket)
      .upload(newPdfFileName, pdfFile);
    
    if (pdfError) throw pdfError;

    // Delete old PDF file
    if (currentDocument.file_path) {
      await supabase.storage
        .from(config.pdfBucket)
        .remove([currentDocument.file_path]);
    }

    pdfPath = newPdfFileName;
  }

  // Upload new thumbnail if provided
  if (thumbnailFile) {
    const newThumbnailFileName = generateUniqueFileName(thumbnailFile.name);
    const { error: thumbnailError } = await supabase.storage
      .from(config.thumbnailBucket)
      .upload(newThumbnailFileName, thumbnailFile);
    
    if (thumbnailError) throw thumbnailError;

    // Delete old thumbnail file if it exists
    if (currentDocument.thumbnail_path) {
      await supabase.storage
        .from(config.thumbnailBucket)
        .remove([currentDocument.thumbnail_path]);
    }

    thumbnailPath = newThumbnailFileName;
  }

  // Update database record
  const { error: dbError } = await supabase
    .from(config.tableName)
    .update({
      title,
      file_path: pdfPath,
      thumbnail_path: thumbnailPath,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (dbError) throw dbError;
};

/**
 * Deletes a document and its associated files
 * @param config - Upload configuration
 * @param document - Document to delete
 * @returns Promise that resolves when deletion is complete
 */
export const deleteDocument = async (
  config: UploadConfig,
  document: BaseDocument
): Promise<void> => {
  // Delete PDF file
  if (document.file_path) {
    await supabase.storage
      .from(config.pdfBucket)
      .remove([document.file_path]);
  }

  // Delete thumbnail file if it exists
  if (document.thumbnail_path) {
    await supabase.storage
      .from(config.thumbnailBucket)
      .remove([document.thumbnail_path]);
  }

  // Delete database record
  const { error: dbError } = await supabase
    .from(config.tableName)
    .delete()
    .eq('id', document.id);

  if (dbError) throw dbError;
};
