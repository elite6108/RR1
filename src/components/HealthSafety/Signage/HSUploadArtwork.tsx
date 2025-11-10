import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  ChevronLeft,
  Plus,
  Trash2,
  AlertTriangle,
  Paperclip,
  Edit,
  Save,
  X,
  CheckSquare,
  Square,
  Search,
  Grid,
  List
} from 'lucide-react';

interface HSUploadArtworkProps {
  onBack: () => void;
}

interface ArtworkFile {
  id: string;
  name: string;
  displayName: string;
  url: string;
  signed_url?: string;
  created_at: string;
}

export function HSUploadArtwork({ onBack }: HSUploadArtworkProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<ArtworkFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<ArtworkFile | null>(null);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = files
    .filter((file) => {
      const query = searchQuery.toLowerCase();
      return file.displayName.toLowerCase().includes(query);
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const generateSignedUrl = async (fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from('signage-artwork')
        .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
      
      return data?.signedUrl || '';
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return '';
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all files using pagination
      let allFiles = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const { data: filesData, error: filesError } = await supabase.storage
          .from('signage-artwork')
          .list('', {
            limit: limit,
            offset: offset,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (filesError) throw filesError;
        if (!filesData || filesData.length === 0) break;

        allFiles = [...allFiles, ...filesData];
        if (filesData.length < limit) break;
        offset += limit;
      }

      const { data: metadataData, error: metadataError } = await supabase
        .from('signage_artwork')
        .select('file_name, display_name');

      if (metadataError) throw metadataError;

      const metadataMap = new Map(
        metadataData?.map((m) => [m.file_name, m.display_name]) || []
      );

      // Generate signed URLs for all files
      const artworkFiles = await Promise.all(
        allFiles
          ?.filter((file) => /\.(jpg|jpeg|png|svg)$/i.test(file.name))
          .map(async (file) => {
            const signedUrl = await generateSignedUrl(file.name);
            return {
              id: file.id,
              name: file.name,
              displayName: metadataMap.get(file.name) || file.name.replace(/\.[^/.]+$/, ''),
              url: signedUrl,
              signed_url: signedUrl,
              created_at: file.created_at,
            };
          }) || []
      );

      // Sort files alphabetically by display name
      artworkFiles.sort((a, b) => a.displayName.localeCompare(b.displayName));
      setFiles(artworkFiles);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching files'
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a function to refresh signed URLs
  const refreshSignedUrls = async () => {
    const updatedFiles = await Promise.all(
      files.map(async (file) => {
        const signedUrl = await generateSignedUrl(file.name);
        return {
          ...file,
          url: signedUrl,
          signed_url: signedUrl,
        };
      })
    );
    setFiles(updatedFiles);
  };

  // Refresh signed URLs every 45 minutes
  useEffect(() => {
    const interval = setInterval(refreshSignedUrls, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, [files]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const getUniqueDisplayName = async (baseName: string, userId: string) => {
        let counter = 1;
        let displayName = baseName;

        while (true) {
          const { data, error } = await supabase
            .from('signage_artwork')
            .select('id')
            .eq('display_name', displayName)
            .eq('user_id', userId)
            .maybeSingle();

          if (error) throw error;
          if (!data) break; // Name is unique

          // Add counter to name
          displayName = `${baseName} (${counter})`;
          counter++;
        }

        return displayName;
      };

      // Validate total upload size (max 50MB)
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const maxTotalSize = 50 * 1024 * 1024; // 50MB
      if (totalSize > maxTotalSize) {
        throw new Error('Total upload size exceeds 50MB limit');
      }

      const sanitizeFileName = (name: string) => {
        // Get file extension
        const ext = name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2);
        // Get base name without extension
        const baseName = name.substring(0, name.lastIndexOf('.'));
        // Sanitize base name
        const sanitizedBase = baseName
          .replace(/[^a-zA-Z0-9]/g, '-')
          .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
          .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
          .toLowerCase();
        // Return sanitized name with extension
        return `${sanitizedBase}.${ext}`;
      };

      // Validate files
      const invalidFiles = files.filter(
        (file) => !/\.(jpe?g|png|svg)$/i.test(file.name.toLowerCase())
      );
      if (invalidFiles.length > 0) {
        throw new Error(
          `Invalid file type(s): ${invalidFiles
            .map((f) => f.name)
            .join(', ')}. Only JPG, PNG, and SVG files are allowed.`
        );
      }

      // Validate file sizes (max 5MB each)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const oversizedFiles = files.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        throw new Error(
          `File(s) too large: ${oversizedFiles
            .map((f) => f.name)
            .join(', ')}. Maximum size per file is 5MB.`
        );
      }

      // Upload all files
      for (const file of files) {
        const sanitizedName = sanitizeFileName(file.name);
        const fileName = `${Date.now()}-${sanitizedName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('signage-artwork')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          if (uploadError.message.includes('duplicate')) {
            throw new Error(
              `File "${file.name}" already exists. Please rename the file or choose a different one.`
            );
          }
          throw new Error(
            `Failed to upload "${file.name}": ${uploadError.message}`
          );
        }

        if (!uploadData) {
          throw new Error(
            `Failed to upload "${file.name}": No response from server`
          );
        }

        // Store metadata
        const { error: metadataError } = await supabase
          .from('signage_artwork')
          .insert([
            {
              file_name: fileName,
              display_name: await getUniqueDisplayName(
                file.name.substring(0, file.name.lastIndexOf('.')),
                user.id
              ),
              user_id: user.id,
            },
          ]);

        if (metadataError) {
          // Try to clean up the uploaded file if metadata insertion fails
          await supabase.storage.from('signage-artwork').remove([fileName]);
          throw new Error(
            `Failed to save metadata for "${file.name}": ${metadataError.message}`
          );
        }
      }

      await fetchFiles();
      setShowUploadModal(false);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while uploading files'
      );
    } finally {
      setLoading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDelete = (file: ArtworkFile) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    setLoading(true);
    setError(null);

    try {
      const { error: storageError } = await supabase.storage
        .from('signage-artwork')
        .remove([fileToDelete.name]);

      if (storageError) throw storageError;

      // Delete metadata
      const { error: metadataError } = await supabase
        .from('signage_artwork')
        .delete()
        .eq('file_name', fileToDelete.name);

      if (metadataError) throw metadataError;

      await fetchFiles();
      setShowDeleteModal(false);
      setFileToDelete(null);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the file'
      );
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (file: ArtworkFile) => {
    setEditingFile(file.id);
    setEditingName(file.displayName);
  };

  const cancelEditing = () => {
    setEditingFile(null);
    setEditingName('');
  };

  const saveDisplayName = async (file: ArtworkFile, newName: string) => {
    try {
      setSavingName(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('signage_artwork').upsert({
        file_name: file.name,
        display_name: newName,
        user_id: user.id,
      });

      if (error) throw error;

      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, displayName: newName } : f))
      );
      setEditingFile(null);
      setEditingName('');
    } catch (err) {
      console.error('Error saving display name:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while saving the display name'
      );
    } finally {
      setSavingName(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls((prev) => new Set(prev).add(url));
      setTimeout(() => {
        setCopiedUrls((prev) => {
          const newSet = new Set(prev);
          newSet.delete(url);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      setError('Failed to copy URL to clipboard');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Delete files from storage
      const filesToDelete = files.filter((file) => selectedFiles.has(file.id));

      for (const file of filesToDelete) {
        const { error: storageError } = await supabase.storage
          .from('signage-artwork')
          .remove([file.name]);

        if (storageError) throw storageError;

        // Delete metadata
        const { error: metadataError } = await supabase
          .from('signage_artwork')
          .delete()
          .eq('file_name', file.name);

        if (metadataError) throw metadataError;
      }

      await fetchFiles();
      setSelectedFiles(new Set());
    } catch (err) {
      console.error('Error deleting files:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting files'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    setError(null);

    try {
      // Delete all files from storage
      const { error: storageError } = await supabase.storage
        .from('signage-artwork')
        .remove(files.map((file) => file.name));

      if (storageError) throw storageError;

      // Delete all metadata
      const { error: metadataError } = await supabase
        .from('signage_artwork')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (metadataError) throw metadataError;

      await fetchFiles();
      setShowDeleteAllModal(false);
    } catch (err) {
      console.error('Error deleting all files:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting all files'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Signage Management
        </button>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">Upload Artwork</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Artwork Library</h2>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {isGridView ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Artwork
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Search and Actions Bar */}
      <div className="flex items-center justify-between space-x-4">
        <div className="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search h-5 w-5 text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg></div>
          <input
            type="text"
            placeholder="Search artwork..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {selectedFiles.size > 0 && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedFiles.size} selected
            </span>
            <button
              onClick={() => setShowDeleteAllModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No artwork matches your search' : 'No artwork available'}
            </p>
          </div>
        ) : (
          <div className={isGridView ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6" : "divide-y divide-gray-200 dark:divide-gray-700"}>
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={isGridView 
                  ? "bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                  : "flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              >
                {isGridView ? (
                  <div>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-600">
                      <img
                        src={file.signed_url || ''}
                        alt={file.displayName}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      {editingFile === file.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <button
                            onClick={() => saveDisplayName(file, editingName)}
                            disabled={savingName}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.displayName}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => copyToClipboard(file.url)}
                              className={`${
                                copiedUrls.has(file.url)
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                              }`}
                              title="Copy URL"
                            >
                              <Paperclip className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => startEditing(file)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(file)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleFileSelection(file.id)}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              {selectedFiles.has(file.id) ? (
                                <CheckSquare className="h-4 w-4" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-100 dark:bg-gray-600 rounded">
                        <img
                          src={file.signed_url || ''}
                          alt={file.displayName}
                          className="object-contain w-full h-full rounded"
                        />
                      </div>
                      {editingFile === file.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <button
                            onClick={() => saveDisplayName(file, editingName)}
                            disabled={savingName}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-white">
                          {file.displayName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className={`${
                          copiedUrls.has(file.url)
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        title="Copy URL"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => startEditing(file)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleFileSelection(file.id)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {selectedFiles.has(file.id) ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Upload Artwork
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".jpg,.jpeg,.png,.svg"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG, SVG up to 5MB each (max 50MB total)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && fileToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete "{fileToDelete.displayName}"? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setFileToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
              Confirm Bulk Deletion
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete {selectedFiles.size} selected items? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
