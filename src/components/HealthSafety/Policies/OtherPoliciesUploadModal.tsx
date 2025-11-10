import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { X, Upload, Loader2, AlertCircle, Edit2 } from 'lucide-react';

interface OtherPoliciesUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FileWithDisplayName {
  file: File;
  displayName: string;
}

export function OtherPoliciesUploadModal({ onClose, onSuccess }: OtherPoliciesUploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileWithDisplayName[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate files
      const invalidFiles = files.filter(file => file.type !== 'application/pdf');
      if (invalidFiles.length > 0) {
        setError('Only PDF files are allowed');
        return;
      }
      
      // Validate file sizes (max 10MB each)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      const oversizedFiles = files.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setError('Some files are too large. Maximum size allowed is 10MB per file');
        return;
      }
      
      // Process valid files
      const processedFiles = files.map(file => ({
        file,
        displayName: file.name.replace(/\.pdf$/i, '').trim()
      }));
      
      setSelectedFiles(processedFiles);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate file selection
    if (selectedFiles.length === 0) {
      setError('Please select at least one PDF file to upload');
      return;
    }

    // Validate display names
    const emptyNames = selectedFiles.some(file => !file.displayName.trim());
    if (emptyNames) {
      setError('All files must have a name');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
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
          .from('other-policies')
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
          .from('other_policy_files')
          .insert(metadata);

        if (metadataError) {
          console.error('Metadata error:', metadataError);
          // If metadata insertion fails, try to clean up the uploaded file
          const { error: cleanupError } = await supabase.storage
            .from('other-policies')
            .remove([fileName]);
          
          if (cleanupError) {
            console.error('Failed to clean up file after metadata error:', cleanupError);
          }

          throw new Error(`Failed to save metadata for "${displayName}": ${metadataError.message}`);
        }
        console.log('Metadata saved successfully:', metadataData);
      }
      
      console.log('All files uploaded successfully');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error uploading PDFs:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while uploading the PDFs');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingName('');
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingName(selectedFiles[index].displayName);
  };

  const saveFileName = (index: number) => {
    const trimmedName = editingName.trim();
    if (!trimmedName) {
      setError('File name cannot be empty');
      return;
    }

    setSelectedFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, displayName: trimmedName } : file
    ));
    setEditingIndex(null);
    setEditingName('');
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFileName(index);
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditingName('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 z-50"></div>
      <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl p-6 max-w-md w-full m-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upload Other Policy PDFs</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Files
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="application/pdf"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF files up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Selected Files:</h3>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1 min-w-0 mr-4">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => saveFileName(index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 truncate">{file.displayName}</span>
                          <button
                            type="button"
                            onClick={() => startEditing(index)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            title="Edit name"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-900 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-md">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-red-600 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedFiles.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload PDFs'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 