import { supabase } from '../../../../../lib/supabase';

export interface FileWithDisplayName {
  file: File;
  displayName: string;
}

export const validateFiles = (files: File[]): string | null => {
  // Validate files
  const invalidFiles = files.filter(file => file.type !== 'application/pdf');
  if (invalidFiles.length > 0) {
    return 'Only PDF files are allowed';
  }
  
  // Validate file sizes (max 10MB each)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  const oversizedFiles = files.filter(file => file.size > maxSize);
  if (oversizedFiles.length > 0) {
    return 'Some files are too large. Maximum size allowed is 10MB per file';
  }
  
  return null;
};

export const processFiles = (files: File[]): FileWithDisplayName[] => {
  return files.map(file => ({
    file,
    displayName: file.name.replace(/\.pdf$/i, '').trim()
  }));
};

export const uploadFilesToSupabase = async (
  selectedFiles: FileWithDisplayName[],
  bucketName: string,
  tableName: string
): Promise<void> => {
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('User authentication error:', userError);
    throw new Error('Authentication error: ' + userError.message);
  }
  if (!user) throw new Error('User not authenticated');
  console.log('User authenticated:', user.id);

  // Upload all files
  for (const { file, displayName } of selectedFiles) {
    console.log(`Starting upload for file: ${displayName}`);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Format the filename
    const fileName = `${displayName.replace(/[^a-zA-Z0-9-_]/g, '-')}-${Date.now()}.pdf`;
    console.log(`Formatted filename: ${fileName}`);
    
    // Upload the file
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      if (uploadError.message.includes('duplicate')) {
        throw new Error(`A file with the name "${displayName}" already exists`);
      } else if (uploadError.message.includes('permission')) {
        throw new Error('You do not have permission to upload files');
      } else {
        throw new Error(`Upload failed for "${displayName}": ${uploadError.message}`);
      }
    }
    console.log('File uploaded successfully:', uploadData);

    // Store the metadata
    const metadata = {
      file_name: fileName,
      display_name: displayName,
      user_id: user.id,
      type: 'uploaded'
    };
    console.log('Attempting to save metadata:', metadata);

    const { error: metadataError, data: metadataData } = await supabase
      .from(tableName)
      .insert(metadata);

    if (metadataError) {
      console.error('Metadata error:', metadataError);
      // If metadata insertion fails, try to clean up the uploaded file
      const { error: cleanupError } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);
      
      if (cleanupError) {
        console.error('Failed to clean up file after metadata error:', cleanupError);
      }

      throw new Error(`Failed to save metadata for "${displayName}": ${metadataError.message}`);
    }
    console.log('Metadata saved successfully:', metadataData);
  }
};
