import { supabase } from '../../../../../lib/supabase';
import { CoshhMSDS, SafetySheetsFormData } from '../types';

export const useSafetySheetsActions = () => {
  
  // Upload MSDS sheet
  const uploadMSDS = async (
    formData: SafetySheetsFormData,
    selectedFile: File
  ): Promise<void> => {
    if (!selectedFile || !formData.substance_name || !formData.manufacturer) {
      throw new Error('Please fill in all required fields and select a file.');
    }

    // Generate unique filename
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Date.now()}_${formData.substance_name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('coshh-msds')
      .upload(filePath, selectedFile);

    if (uploadError) throw uploadError;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Save record to database
    const { error: dbError } = await supabase
      .from('coshh_msds')
      .insert({
        substance_name: formData.substance_name,
        manufacturer: formData.manufacturer,
        file_name: selectedFile.name,
        file_path: uploadData.path,
        file_size: selectedFile.size,
        coshh_register_id: formData.coshh_register_id || null,
        uploaded_by: user?.id
      });

    if (dbError) throw dbError;
  };

  // Delete MSDS sheet
  const deleteMSDS = async (sheet: CoshhMSDS): Promise<void> => {
    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('coshh-msds')
      .remove([sheet.file_path]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete record from database
    const { error: dbError } = await supabase
      .from('coshh_msds')
      .delete()
      .eq('id', sheet.id);

    if (dbError) throw dbError;
  };

  // Download MSDS file
  const downloadMSDS = async (msds: CoshhMSDS): Promise<void> => {
    const { data, error } = await supabase.storage
      .from('coshh-msds')
      .download(msds.file_path);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = msds.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Preview MSDS file
  const previewMSDS = async (msds: CoshhMSDS): Promise<void> => {
    const { data, error } = await supabase.storage
      .from('coshh-msds')
      .download(msds.file_path);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    window.open(url, '_blank');
  };

  return {
    uploadMSDS,
    deleteMSDS,
    downloadMSDS,
    previewMSDS
  };
};
