import { supabase } from '../../../../../../../../lib/supabase';
export const handleHospitalTreatmentFileUpload = async (
  files: FileList, 
  autoId: string,
  setUploadingFiles: (uploading: boolean) => void,
  setError: (error: string | null) => void
): Promise<string[]> => {
  if (!files || files.length === 0) return [];
  
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
      const { data, error: uploadError } = await supabase.storage
        .from('accidents-hospitaltreatment')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // For private buckets, we need to use createSignedUrl instead of getPublicUrl
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('accidents-hospitaltreatment')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry
      
      if (signedUrlData?.signedUrl) {
        uploadedUrls.push(signedUrlData.signedUrl);
      }
    }
    
    return uploadedUrls;
  } catch (err) {
    console.error('Error uploading files:', err);
    setError('Failed to upload files. Please try again.');
    return [];
  } finally {
    setUploadingFiles(false);
  }
};

export const refreshHospitalTreatmentFileUrls = async (fileUrls: string[]): Promise<string[]> => {
  try {
    const newUrls = await Promise.all(
      fileUrls.map(async (url: string) => {
        const pathMatch = url.match(/\/object\/sign\/([^?]+)/);
        if (pathMatch) {
          let path = pathMatch[1];
          
          // Remove the bucket name if it's at the beginning of the path
          if (path.startsWith('accidents-hospitaltreatment/')) {
            path = path.replace('accidents-hospitaltreatment/', '');
          }
          
          const { data, error } = await supabase.storage
            .from('accidents-hospitaltreatment')
            .createSignedUrl(path, 60 * 60 * 24 * 7);
          
          if (data?.signedUrl) {
            return data.signedUrl;
          } else {
            console.error('Error refreshing URL:', error);
          }
        }
        return url;
      })
    );
    
    return newUrls;
  } catch (error) {
    console.error('Error refreshing signed URLs:', error);
    return fileUrls;
  }
};
