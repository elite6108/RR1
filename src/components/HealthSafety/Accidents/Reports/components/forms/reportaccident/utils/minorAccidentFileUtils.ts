import { supabase } from '../../../../../../../../lib/supabase';
export const handleMinorAccidentFileUpload = async (
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
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `${autoId}/${fileName}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('accidents-minoraccident')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('accidents-minoraccident')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);
      
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

export const refreshMinorAccidentFileUrls = async (fileUrls: string[]): Promise<string[]> => {
  try {
    const newUrls = await Promise.all(
      fileUrls.map(async (url: string) => {
        const pathMatch = url.match(/\/object\/sign\/([^?]+)/);
        if (pathMatch) {
          let path = pathMatch[1];
          
          if (path.startsWith('accidents-minoraccident/')) {
            path = path.replace('accidents-minoraccident/', '');
          }
          
          const { data, error } = await supabase.storage
            .from('accidents-minoraccident')
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
