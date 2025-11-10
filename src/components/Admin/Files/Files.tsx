import React, { useState, useEffect, useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { 
  FileText, 
  Upload, 
  FolderPlus, 
  Grid3X3, 
  List, 
  Trash2, 
  Download,
  X,
  ChevronRight,
  Menu,
  ChevronLeft,
  BookMarked,
  ChevronDown
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useFiles } from './hooks/useFiles';
import { useFolders } from './hooks/useFolders';
import { useFileUpload } from './hooks/useFileUpload';
import { useFileAssignment } from './hooks/useFileAssignment';
import { validateMove, parseFileNameAndExtension } from './utils/helpers';
import { ACCEPTED_FILE_TYPES } from './utils/constants';
import {
  FolderTreeItem,
  FileIcon,
  FilePreview,
  FileListView,
  FileGridView,
  UploadModal,
  FolderModal,
  FileEditModal,
  ConfirmationModal
} from './components';
import type { FilesProps, ViewMode, CompanyFile } from './types';

export function Files({ onBack }: FilesProps) {
  // State management
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal states
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showEditFileModal, setShowEditFileModal] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState<CompanyFile | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [filesToDelete, setFilesToDelete] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<CompanyFile | null>(null);
  const [editName, setEditName] = useState('');
  const [originalExtension, setOriginalExtension] = useState('');
  
  // Drag and drop states
  const [draggedItem, setDraggedItem] = useState<CompanyFile | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  
  // Refs
  const assignDropdownRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { companyFiles, loading, breadcrumbs, fetchFiles, createFolder, deleteFiles, moveFile, updateFileName } = useFiles(currentFolder);
  const { allFolders, fetchAllFolders } = useFolders();
  const { 
    isUploading, 
    uploadProgress, 
    isDragOverUpload, 
    isDragOverMainPane, 
    fileInputRef,
    handleFileUpload,
    handleFileInputChange,
    handleUploadDragEnter,
    handleUploadDragLeave,
    handleUploadDragOver,
    handleUploadDrop,
    handleMainPaneDragEnter,
    handleMainPaneDragLeave,
    handleMainPaneDragOver,
    handleMainPaneDrop
  } = useFileUpload(currentFolder, () => {
    fetchFiles();
    setShowUploadModal(false);
  });
  const { loading: assignmentLoading, assignmentAction, setAssignmentAction, confirmAssignmentAction } = useFileAssignment(() => {
    fetchFiles();
    setShowAssignModal(false);
    setAssignmentAction(null);
  });

  // Effects
  useEffect(() => {
    fetchAllFolders();
  }, [fetchAllFolders]);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (assignDropdownRef.current && !assignDropdownRef.current.contains(event.target as Node)) {
        setShowAssignDropdown(false);
      }
    };

    if (showAssignDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAssignDropdown]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 768) {
        const sidebar = document.getElementById('mobile-sidebar');
        const target = event.target as Node;
        if (sidebar && !sidebar.contains(target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Helper functions
  const getCurrentFolderName = () => {
    if (!currentFolder) return 'Files Management';
    const folder = allFolders.find(f => f.id === currentFolder);
    return folder ? folder.name : 'Files Management';
  };

  const goToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    setSelectedFiles(new Set());
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

  const selectAll = () => {
    if (selectedFiles.size === companyFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(companyFiles.map(f => f.id)));
    }
  };

  // File operations
  const openFileModal = async (file: CompanyFile) => {
    if (file.is_folder) {
      goToFolder(file.id);
      return;
    }

    setSelectedFile(file);
    setShowFileModal(true);

    if (file.storage_path) {
      try {
        const { data } = await supabase.storage
          .from('company-files')
          .createSignedUrl(file.storage_path, 3600); 

        if (data?.signedUrl) {
          setFilePreviewUrl(data.signedUrl);
        } else {
          setFilePreviewUrl(null);
        }
      } catch (error) {
        console.error('Error generating preview URL:', error);
        setFilePreviewUrl(null);
      }
    } else {
      setFilePreviewUrl(null);
    }
  };

  const downloadFile = async (file: CompanyFile) => {
    if (file.is_folder || !file.storage_path) return;

    try {
      const { data, error } = await supabase.storage
        .from('company-files')
        .download(file.storage_path);

      if (error) throw error;
      if (!data) return;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Modal handlers
  const handleCreateFolder = async () => {
    const success = await createFolder(newFolderName, currentFolder);
    if (success) {
      setNewFolderName('');
      setShowNewFolderModal(false);
      fetchAllFolders();
    }
  };

  const handleDeleteClick = (fileIds: Set<string>) => {
    setFilesToDelete(fileIds);
    setShowDeleteModal(true);
  };

  const handleSingleDelete = (fileId: string) => {
    handleDeleteClick(new Set([fileId]));
  };

  const handleBulkDelete = () => {
    if (selectedFiles.size > 0) {
      handleDeleteClick(selectedFiles);
    }
  };

  const confirmDelete = async () => {
    const success = await deleteFiles(Array.from(filesToDelete));
    if (success) {
      setFilesToDelete(new Set());
      setSelectedFiles(new Set());
      setShowDeleteModal(false);
      fetchAllFolders();
    }
  };

  const handleEditClick = (item: CompanyFile) => {
    setEditingItem(item);
    
    if (item.is_folder) {
      setEditName(item.name);
      setOriginalExtension('');
      setShowEditFolderModal(true);
    } else {
      const { name, extension } = parseFileNameAndExtension(item.name);
      setEditName(name);
      setOriginalExtension(extension);
      setShowEditFileModal(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !editName.trim()) return;
    
    const finalName = editingItem.is_folder ? editName.trim() : editName.trim() + originalExtension;
    const success = await updateFileName(editingItem.id, finalName);
    
    if (success) {
      setShowEditFolderModal(false);
      setShowEditFileModal(false);
      setEditingItem(null);
      setEditName('');
      setOriginalExtension('');
      if (editingItem.is_folder) {
        fetchAllFolders();
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, file: CompanyFile) => {
    e.dataTransfer.setData('application/json', JSON.stringify(file));
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      setDraggedItem(file);
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e: React.DragEvent, targetFile?: CompanyFile) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (targetFile && targetFile.is_folder && targetFile.id !== draggedItem.id) {
      setDragOverItem(targetFile.id);
    } else if (!targetFile) {
      setDragOverItem('background');
    } else {
      setDragOverItem(null);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverItem(null);
  };

  const handleDrop = async (e: React.DragEvent, targetFile?: CompanyFile) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedItem: CompanyFile = JSON.parse(e.dataTransfer.getData('application/json'));
    setDraggedItem(null);
    setDragOverItem(null);

    const targetFolderId = targetFile && targetFile.is_folder ? targetFile.id : (targetFile ? targetFile.parent_folder_id : currentFolder);
    
    if (!validateMove(droppedItem, targetFolderId || null, allFolders)) return;

    const success = await moveFile(droppedItem.id, targetFolderId || null);
    if (success) {
      fetchAllFolders();
    }
  };

  // Assignment handlers
  const handleAssignmentAction = (type: 'assign' | 'remove', category: 'handbook' | 'annual_training', file: CompanyFile) => {
    setAssignmentAction({ type, category, file });
    setShowAssignDropdown(false);
    setShowAssignModal(true);
  };

  const handleConfirmAssignment = async () => {
    const success = await confirmAssignmentAction();
    if (success) {
      // Assignment completed successfully
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Fragment>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Company Section
        </button>
       </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">File Management</h2>
      </div>
      <br />
      
      <div className="h-[calc(100vh-200px)] flex bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative shadow-lg">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}

        {/* Left Sidebar - Folder Navigation */}
        <div 
          id="mobile-sidebar"
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:relative z-[70] md:z-auto w-64 sm:w-72 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out h-full top-0 left-0`}
        >
          {/* Sidebar Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Folders</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded touch-manipulation"
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="w-full inline-flex items-center justify-center px-3 py-2.5 border border-transparent text-sm font-medium rounded-md text-gray-900 dark:text-white bg-[#ffec66] dark:bg-[#2563eb] hover:bg-[#ffe033] dark:hover:bg-[#1d4ed8] transition-colors touch-manipulation shadow-sm"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </button>
          </div>

          {/* Folder Tree */}
          <div className="flex-1 overflow-y-auto p-2">
            <FolderTreeItem
              folder={null}
              currentFolder={currentFolder}
              onFolderClick={goToFolder}
              level={0}
              allFolders={allFolders}
              onMobileClose={() => setSidebarOpen(false)}
            />
            {allFolders
              .filter(folder => !folder.parent_folder_id)
              .map(folder => (
                <FolderTreeItem
                  key={folder.id}
                  folder={folder}
                  currentFolder={currentFolder}
                  onFolderClick={goToFolder}
                  level={0}
                  allFolders={allFolders}
                  onMobileClose={() => setSidebarOpen(false)}
                />
              ))}
          </div>
        </div>

        {/* Right Content - Files */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded touch-manipulation"
                  >
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {getCurrentFolderName()}
                    </h2>
                    {breadcrumbs.length > 0 && (
                      <nav className="flex items-center space-x-1 mt-1 overflow-x-auto">
                        <button
                          onClick={() => goToFolder(null)}
                          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 whitespace-nowrap touch-manipulation"
                        >
                          Root
                        </button>
                        {breadcrumbs.map((crumb, index) => (
                          <Fragment key={crumb.id}>
                            <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <button
                              onClick={() => goToFolder(crumb.id)}
                              className={`text-xs sm:text-sm whitespace-nowrap touch-manipulation ${
                                index === breadcrumbs.length - 1
                                  ? 'text-gray-500 dark:text-gray-400'
                                  : 'text-blue-600 hover:text-blue-800 dark:text-blue-400'
                              }`}
                            >
                              {crumb.name}
                            </button>
                          </Fragment>
                        ))}
                      </nav>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                {/* View Mode Toggle */}
                <div className="flex rounded-md shadow-sm">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2 sm:px-3 py-2 text-sm font-medium rounded-l-md border touch-manipulation ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2 sm:px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b touch-manipulation ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Upload Button */}
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center px-2 sm:px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors touch-manipulation"
                >
                  <Upload className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Upload</span>
                </button>

                {/* Assignment Dropdown Button */}
                {selectedFiles.size === 1 && (() => {
                  const selectedFile = companyFiles.find(f => selectedFiles.has(f.id));
                  if (selectedFile && !selectedFile.is_folder && selectedFile.mime_type === 'application/pdf') {
                    const hasAssignment = selectedFile.is_employee_handbook || selectedFile.is_annual_training;
                    return (
                      <div className="relative" ref={assignDropdownRef}>
                        <button
                          onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                          className={`inline-flex items-center px-2 sm:px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors touch-manipulation ${
                            hasAssignment 
                              ? 'bg-orange-600 hover:bg-orange-700' 
                              : 'bg-purple-600 hover:bg-purple-700'
                          }`}
                        >
                          <BookMarked className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">
                            {hasAssignment ? 'Manage Assignment' : 'Assign'}
                          </span>
                          <span className="sm:hidden">
                            {hasAssignment ? 'Manage' : 'Assign'}
                          </span>
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </button>

                        {/* Dropdown Menu */}
                        {showAssignDropdown && (
                          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              {!selectedFile.is_employee_handbook && (
                                <button
                                  onClick={() => handleAssignmentAction('assign', 'handbook', selectedFile)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <BookMarked className="inline h-4 w-4 mr-2 text-green-500" />
                                  Assign as Employee Handbook
                                </button>
                              )}
                              {selectedFile.is_employee_handbook && (
                                <button
                                  onClick={() => handleAssignmentAction('remove', 'handbook', selectedFile)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <X className="inline h-4 w-4 mr-2 text-red-500" />
                                  Remove Employee Handbook
                                </button>
                              )}
                              {!selectedFile.is_annual_training && (
                                <button
                                  onClick={() => handleAssignmentAction('assign', 'annual_training', selectedFile)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <BookMarked className="inline h-4 w-4 mr-2 text-blue-500" />
                                  Assign as Annual Training
                                </button>
                              )}
                              {selectedFile.is_annual_training && (
                                <button
                                  onClick={() => handleAssignmentAction('remove', 'annual_training', selectedFile)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <X className="inline h-4 w-4 mr-2 text-red-500" />
                                  Remove Annual Training
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Delete Selected */}
                {selectedFiles.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center px-2 sm:px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Delete ({selectedFiles.size})</span>
                    <span className="sm:hidden">({selectedFiles.size})</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* File Content Area */}
          <div 
            className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 relative ${
              isDragOverMainPane ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
            }`}
            onDragEnter={(e) => handleMainPaneDragEnter(e, draggedItem)}
            onDragLeave={(e) => handleMainPaneDragLeave(e, draggedItem)}
            onDragOver={(e) => handleMainPaneDragOver(e, draggedItem)}
            onDrop={(e) => handleMainPaneDrop(e, draggedItem)}
          >
            {/* Drag overlay for main pane */}
            {isDragOverMainPane && (
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 border-4 border-dashed border-blue-500 z-10 flex items-center justify-center">
                <div className="text-center">
                  <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                    Drop files here to upload
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Files will be uploaded to {getCurrentFolderName()}
                  </p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : companyFiles.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No files</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No files have been uploaded to this folder yet.
                </p>
              </div>
            ) : (
              <div className={viewMode === 'list' ? 'p-2 sm:p-4' : ''}>
                {viewMode === 'list' ? (
                  <FileListView
                    files={companyFiles}
                    selectedFiles={selectedFiles}
                    draggedItem={draggedItem}
                    dragOverItem={dragOverItem}
                    onSelectAll={selectAll}
                    onToggleFileSelection={toggleFileSelection}
                    onFileClick={openFileModal}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleSingleDelete}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  />
                ) : (
                  <FileGridView
                    files={companyFiles}
                    selectedFiles={selectedFiles}
                    draggedItem={draggedItem}
                    dragOverItem={dragOverItem}
                    onToggleFileSelection={toggleFileSelection}
                    onFileClick={openFileModal}
                    onFolderClick={goToFolder}
                    onEditClick={handleEditClick}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  />
                )}
              </div>
            )}

            {/* Upload Progress Overlay */}
            {isUploading && Object.keys(uploadProgress).length > 0 && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-20 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Uploading Files...
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(uploadProgress).map(([fileKey, progress]) => {
                      const fileName = fileKey.split('-').slice(0, -1).join('-');
                      return (
                        <div key={fileKey}>
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span className="truncate">{fileName}</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        accept={ACCEPTED_FILE_TYPES}
      />

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        isDragOver={isDragOverUpload}
        onDragEnter={handleUploadDragEnter}
        onDragLeave={handleUploadDragLeave}
        onDragOver={handleUploadDragOver}
        onDrop={handleUploadDrop}
        onFileSelect={() => fileInputRef.current?.click()}
      />

      <FolderModal
        isOpen={showNewFolderModal}
        onClose={() => {
          setShowNewFolderModal(false);
          setNewFolderName('');
        }}
        onSubmit={handleCreateFolder}
        title="Create New Folder"
        value={newFolderName}
        onChange={setNewFolderName}
        placeholder="Folder name"
        submitText="Create"
      />

      <FolderModal
        isOpen={showEditFolderModal}
        onClose={() => {
          setShowEditFolderModal(false);
          setEditingItem(null);
          setEditName('');
        }}
        onSubmit={handleSaveEdit}
        title="Edit Folder Name"
        value={editName}
        onChange={setEditName}
        placeholder="Folder name"
        submitText="Save"
        loading={loading}
      />

      <FileEditModal
        isOpen={showEditFileModal}
        onClose={() => {
          setShowEditFileModal(false);
          setEditingItem(null);
          setEditName('');
          setOriginalExtension('');
        }}
        onSubmit={handleSaveEdit}
        fileName={editName}
        onFileNameChange={setEditName}
        extension={originalExtension}
        loading={loading}
      />

      {/* File View Modal */}
      {showFileModal && selectedFile && createPortal(
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <FileIcon file={selectedFile} />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">
                    {selectedFile.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadFile(selectedFile)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Download file"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setShowFileModal(false);
                    setFilePreviewUrl(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(95vh-5rem)]">
              <FilePreview
                file={selectedFile}
                previewUrl={filePreviewUrl}
                onDownload={downloadFile}
                onPreviewError={() => setFilePreviewUrl(null)}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      <ConfirmationModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setAssignmentAction(null);
        }}
        onConfirm={handleConfirmAssignment}
        title={assignmentAction?.type === 'assign' ? 'Confirm Assignment' : 'Confirm Removal'}
        message={
          assignmentAction?.type === 'assign' 
            ? `Are you sure you want to assign "${assignmentAction?.file.name}" as the ${assignmentAction?.category === 'handbook' ? 'Employee Handbook' : 'Annual Training'}?`
            : `Are you sure you want to remove "${assignmentAction?.file.name}" from being the ${assignmentAction?.category === 'handbook' ? 'Employee Handbook' : 'Annual Training'}?`
        }
        confirmText={assignmentAction?.type === 'assign' ? 'Assign' : 'Remove'}
        type="info"
        loading={assignmentLoading}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setFilesToDelete(new Set());
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={
          filesToDelete.size === 1 
            ? 'Are you sure you want to delete this item? This action cannot be undone.'
            : `Are you sure you want to delete these ${filesToDelete.size} items? This action cannot be undone.`
        }
        confirmText="Delete"
        type="danger"
        loading={loading}
      />
    </Fragment>
  );
}