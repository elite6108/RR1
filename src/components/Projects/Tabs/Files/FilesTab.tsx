import React, { useState, useEffect, Fragment } from 'react';
import { 
  FileText, 
  Upload, 
  FolderPlus, 
  LayoutGrid, 
  List, 
  Trash2, 
  X,
  ChevronRight,
  Menu
} from 'lucide-react';

// Import our extracted modules
import { FilesTabProps, ViewMode, ProjectFile } from './types';
import { useFileOperations, useFilePreview } from './hooks';
import { FolderTreeItem } from './components';
import { ListView, GridView } from './components/FileViews';
import { UploadModal, FolderModal, FileModal, DeleteModal } from './components/Modals';
import { getCurrentFolderName } from './utils';

export function FilesTab({ project, onFilesChange }: FilesTabProps) {
  // Use our custom hooks
  const {
    projectFiles,
    allFolders,
    currentFolder,
    loading,
    breadcrumbs,
    fileInputRef,
    handleFileUpload,
    createFolder,
    deleteFiles,
    moveFile,
    updateFileName,
    goToFolder
  } = useFileOperations(project.id, onFilesChange);

  const {
    showFileModal,
    selectedFile,
    filePreviewUrl,
    openFileModal,
    closeFileModal,
    downloadFile
  } = useFilePreview();

  // Local state for UI interactions
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<ProjectFile | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectFile | null>(null);
  const [editName, setEditName] = useState('');

  // Reset selected files when folder changes
  useEffect(() => {
    setSelectedFiles(new Set());
  }, [currentFolder]);

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

  // Simplified event handlers using hooks
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(files);
      setShowUploadModal(false);
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await createFolder(newFolderName);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const confirmDelete = async () => {
    await deleteFiles(filesToDelete);
      setSelectedFiles(new Set());
      setFilesToDelete(new Set());
      setShowDeleteModal(false);
  };

  const handleDeleteClick = (fileIds: Set<string>) => {
    setFilesToDelete(fileIds);
    setShowDeleteModal(true);
  };

  const handleSingleDelete = (fileId: string) => {
    handleDeleteClick(new Set([fileId]));
  };

  const handleBulkDelete = () => {
    handleDeleteClick(selectedFiles);
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
    if (selectedFiles.size === projectFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(projectFiles.map(f => f.id)));
    }
  };

  // Edit handlers
  const handleEditClick = (item: ProjectFile) => {
    setEditingItem(item);
    setEditName(item.name);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (editingItem && editName.trim()) {
      const success = await updateFileName(editingItem.id, editName.trim());
      if (success) {
        setShowEditModal(false);
        setEditingItem(null);
        setEditName('');
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLElement>, file: ProjectFile) => {
    setDraggedItem(file);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', file.id);
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLElement>) => {
    setDraggedItem(null);
    setDragOverItem(null);
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>, targetFile?: ProjectFile) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!targetFile || targetFile.is_folder) {
      setDragOverItem(targetFile?.id || 'current-folder');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverItem(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLElement>, targetFile?: ProjectFile) => {
    e.preventDefault();
    setDragOverItem(null);

    if (!draggedItem) return;

    const targetFolderId = targetFile?.id || currentFolder;
    
    if (targetFile && !targetFile.is_folder) {
      return;
    }

    const success = await moveFile(draggedItem, targetFolderId);
    if (success) {
      setDraggedItem(null);
    }
  };

  return (
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
                    {getCurrentFolderName(currentFolder, breadcrumbs)}
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
                  <LayoutGrid className="h-4 w-4" />
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
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : projectFiles.length === 0 ? (
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
                <ListView
                  projectFiles={projectFiles}
                  viewMode={viewMode}
                  selectedFiles={selectedFiles}
                  dragOverItem={dragOverItem}
                  onSelectAll={selectAll}
                  onToggleFileSelection={toggleFileSelection}
                  onFolderClick={goToFolder}
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
                <GridView
                  projectFiles={projectFiles}
                  selectedFiles={selectedFiles}
                  dragOverItem={dragOverItem}
                  onToggleFileSelection={toggleFileSelection}
                  onFolderClick={goToFolder}
                  onFileClick={openFileModal}
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
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.ppt,.pptx"
      />

      {/* Modals */}
      <UploadModal
        show={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onFileSelect={() => fileInputRef.current?.click()}
        currentFolderName={getCurrentFolderName(currentFolder, breadcrumbs)}
      />

      <FolderModal
        show={showNewFolderModal}
        onClose={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                }}
        onSubmit={handleCreateFolder}
        value={newFolderName}
        onChange={setNewFolderName}
        title="Create New Folder"
      />

      <FolderModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
                  setEditingItem(null);
                  setEditName('');
                }}
        onSubmit={handleSaveEdit}
              value={editName}
        onChange={setEditName}
        title={editingItem?.is_folder ? 'Edit Folder Name' : 'Edit File Name'}
        loading={loading}
      />

      <FileModal
        show={showFileModal}
        onClose={closeFileModal}
        file={selectedFile}
        filePreviewUrl={filePreviewUrl}
        onDownload={downloadFile}
      />

      <DeleteModal
        show={showDeleteModal}
        onClose={() => {
                  setShowDeleteModal(false);
                  setFilesToDelete(new Set());
                }}
        onConfirm={confirmDelete}
        itemCount={filesToDelete.size}
        loading={loading}
      />
    </div>
  );
}
