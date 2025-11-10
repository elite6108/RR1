import { supabase } from '../../../../../../../../lib/supabase';

export const uploadUnsafeConditionsFile = async (file: File, autoId: string): Promise<string> => {
  // Create a unique file name to avoid collisions
  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const filePath = `${autoId}/${fileName}`;
  
  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('accidents-unsafeconditions')
    .upload(filePath, file);
      
  if (error) throw error;
  
  // For private buckets, we need to use createSignedUrl instead of getPublicUrl
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('accidents-unsafeconditions')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry
  
  if (signedUrlError) {
    console.error('Error creating signed URL:', signedUrlError);
    throw signedUrlError;
  }
  
  // Return the signed URL if it exists
  if (signedUrlData?.signedUrl) {
    console.log('Successfully uploaded file with signed URL:', signedUrlData.signedUrl);
    return signedUrlData.signedUrl;
  }
  
  throw new Error('Failed to create signed URL');
};

export const refreshUnsafeConditionsFileUrls = async (fileUrls: string[]): Promise<string[]> => {
  console.log('Starting to refresh signed URLs...');
  try {
    const newUrls = await Promise.all(
      fileUrls.map(async (url: string) => {
        const pathMatch = url.match(/\/object\/sign\/([^?]+)/);
        if (pathMatch) {
          let path = pathMatch[1];
          console.log('Extracted path from URL:', path);
          
          // Remove the bucket name if it's at the beginning of the path
          if (path.startsWith('accidents-unsafeconditions/')) {
            path = path.replace('accidents-unsafeconditions/', '');
            console.log('Cleaned path (removed bucket name):', path);
          }
          
          console.log('Refreshing URL for path:', path);
          const { data, error } = await supabase.storage
            .from('accidents-unsafeconditions')
            .createSignedUrl(path, 60 * 60 * 24 * 7);
          
          if (data?.signedUrl) {
            console.log('Successfully refreshed URL');
            return data.signedUrl;
          } else {
            console.error('Error refreshing URL:', error);
          }
        }
        return url;
      })
    );
    
    console.log('All refreshed URLs:', newUrls);
    return newUrls;
  } catch (error) {
    console.error('Error refreshing signed URLs:', error);
    return fileUrls; // Return original URLs if refresh fails
  }
};
