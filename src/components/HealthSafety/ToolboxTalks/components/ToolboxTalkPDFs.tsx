import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
  Save,
  X,
  ExternalLink,
  Search
} from 'lucide-react';
import { ToolboxTalkPDFUploadForm } from '../ToolboxTalkPDFUploadForm';
import { usePDFManagement } from '../hooks/usePDFManagement';

interface ToolboxTalkPDFsProps {
  onBack: () => void;
}

interface PDFFile {
  id: string;
  name: string;
  created_at: string;
  size: number;
  url: string;
  signed_url?: string;
  displayName?: string;
  talk_id?: string;
}

export function ToolboxTalkPDFs({ onBack }: ToolboxTalkPDFsProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<PDFFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    loading,
    error,
    pdfFiles,
    editingFile,
    editingName,
    setEditingName,
    editingTalkId,
    setEditingTalkId,
    savingName,
    fetchPDFFiles,
    startEditing,
    cancelEditing,
    saveDisplayName,
    deleteFile,
    formatFileSize
  } = usePDFManagement();

  useEffect(() => {
    fetchPDFFiles();
  }, []);

  const handleDeleteFile = (file: PDFFile) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    await deleteFile(fileToDelete);
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const filteredFiles = pdfFiles.filter((file) => {
    const query = searchQuery.toLowerCase();
    return (
      file.displayName?.toLowerCase().includes(query) ||
      file.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Toolbox Talks
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Toolbox Talk PDFs</h2>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Search Bar with Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Toolbox PDF
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No PDFs match your search' : 'No PDF files uploaded yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:rounded-tl-lg">
                        ID
                      </th>
                      <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        File Name
                      </th>
                      <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th scope="col" className="py-3 px-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider last:rounded-tr-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredFiles.map((file, index) => (
                      <tr key={file.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                        <td className="py-2 px-3 text-sm first:rounded-bl-lg">
                          {editingFile === file.id ? (
                            <input
                              type="text"
                              value={editingTalkId}
                              onChange={(e) => setEditingTalkId(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              placeholder="Enter Talk ID"
                            />
                          ) : (
                            <span className="text-gray-900 dark:text-white">
                              {file.talk_id || '-'}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {editingFile === file.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              />
                              <button
                                onClick={() => saveDisplayName(file, editingName, editingTalkId)}
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
                            <span className="text-gray-900 dark:text-white">
                              {file.displayName || file.name}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(file.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-3 text-right text-sm font-medium last:rounded-br-lg">
                          <div className="flex justify-end space-x-3">
                            <a
                              href={file.signed_url || ''}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                              title="View PDF"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => startEditing(file)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {filteredFiles.map((file) => (
                  <div 
                    key={file.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        {editingFile === file.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              placeholder="File name"
                            />
                            <input
                              type="text"
                              value={editingTalkId}
                              onChange={(e) => setEditingTalkId(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              placeholder="Talk ID"
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                              {file.displayName || file.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              ID: {file.talk_id || 'No ID set'}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {editingFile !== file.id && (
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">File Size:</span>
                          <span className="text-gray-900 dark:text-white">{formatFileSize(file.size)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Uploaded:</span>
                          <span className="text-gray-900 dark:text-white">
                            {new Date(file.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      {editingFile === file.id ? (
                        <>
                          <button
                            onClick={() => saveDisplayName(file, editingName, editingTalkId)}
                            disabled={savingName}
                            className="flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-md transition-colors"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <a
                            href={file.signed_url || ''}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-md transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                          </a>
                          <button
                            onClick={() => startEditing(file)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        createPortal(
          <ToolboxTalkPDFUploadForm
            onClose={() => setShowUploadModal(false)}
            onSuccess={() => {
              fetchPDFFiles();
              setShowUploadModal(false);
            }}
          />,
          document.body
        )
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && fileToDelete && (
        createPortal(
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete "{fileToDelete.displayName || fileToDelete.name}"? This action cannot be undone.
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
          </div>,
          document.body
        )
      )}
    </div>
  );
}
