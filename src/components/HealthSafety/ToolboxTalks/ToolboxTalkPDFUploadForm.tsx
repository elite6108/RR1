import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';

interface ToolboxTalkPDFUploadFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FileWithDisplayName {
  file: File;
  displayName: string;
}

export function ToolboxTalkPDFUploadForm({
  onClose,
  onSuccess,
}: ToolboxTalkPDFUploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileWithDisplayName[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Validate files
      const invalidFiles = files.filter(
        (file) => file.type !== 'application/pdf'
      );
      if (invalidFiles.length > 0) {
        setError('Only PDF files are allowed');
        return;
      }

      // Validate file sizes (max 10MB each)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      const oversizedFiles = files.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setError(
          'Some files are too large. Maximum size allowed is 10MB per file'
        );
        return;
      }

      // Process valid files
      const processedFiles = files.map((file) => ({
        file,
        displayName: file.name.replace(/\.pdf$/i, ''),
      }));

      setSelectedFiles(processedFiles);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError('Please select at least one PDF file to upload');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Upload all files
      for (const { file, displayName } of selectedFiles) {
        // Format the filename
        const fileName = `${displayName}-${Date.now()}.pdf`;

        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('toolbox-talks')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          if (uploadError.message.includes('duplicate')) {
            throw new Error(
              `A file with the name "${displayName}" already exists`
            );
          } else {
            throw new Error(
              `Upload failed for "${displayName}": ${uploadError.message}`
            );
          }
        }

        // Store the metadata
        const { error: metadataError } = await supabase
          .from('toolbox_talk_pdfs')
          .insert({
            file_name: fileName,
            display_name: displayName,
            user_id: user.id,
          });

        if (metadataError) {
          throw new Error(
            `Failed to save metadata for "${displayName}": ${metadataError.message}`
          );
        }
      }

      onSuccess();
    } catch (err) {
      console.error('Error uploading PDFs:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while uploading the PDFs'
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload Toolbox Talk PDFs</h2>
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
              <h3 className="text-sm font-medium text-gray-700">
                Selected Files:
              </h3>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <span className="text-sm text-gray-600">
                    {file.displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-900"
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
  );
}
