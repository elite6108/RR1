import { useState } from 'react';
import { supabase } from '../../../../../../../../lib/supabase';

export function useFileUpload(
  bucketName: string,
  setError: (error: string | null) => void,
  setFormData: (updater: (prev: any) => any) => void
) {
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleFileUpload = async (files: FileList, fieldName: 'file_urls', autoId: string) => {
    if (!files || files.length === 0) return;
    
    try {
      setUploadingFiles(true);
      setError(null);
      
      const uploadedUrls: string[] = [];
      
      // Create an array from FileList for easier handling
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        // Create a unique file name to avoid collisions
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `${autoId}/${fileName}`;
        
        // Upload the file to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);
          
        if (error) throw error;
        
        // For private buckets, we need to use createSignedUrl instead of getPublicUrl
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry
        
        if (signedUrlError) {
          console.error('Error creating signed URL:', signedUrlError);
          throw signedUrlError;
        }
        
        // Add the signed URL to our array if it exists
        if (signedUrlData?.signedUrl) {
          console.log('Successfully uploaded file with signed URL:', signedUrlData.signedUrl);
          uploadedUrls.push(signedUrlData.signedUrl);
        }
      }
      
      // Update the form data with the new URLs
      setFormData(prev => {
        const newData = {
          ...prev,
          [fieldName]: [...prev[fieldName] as string[], ...uploadedUrls]
        };
        console.log('Updated formData.file_urls:', newData.file_urls);
        console.log('Number of files now:', newData.file_urls.length);
        return newData;
      });
      
    } catch (err) {
      console.error(`Error uploading ${fieldName}:`, err);
      setError(`Failed to upload files. Please try again.`);
    } finally {
      setUploadingFiles(false);
    }
  };

  return { handleFileUpload, uploadingFiles };
}
