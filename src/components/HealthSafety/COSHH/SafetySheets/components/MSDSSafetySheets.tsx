import React, { useEffect } from 'react';
import { ChevronLeft, Search, Plus, FileCheck } from 'lucide-react';
import { MSDSSafetySheetsProps } from '../types';
import { useSafetySheetsState } from '../hooks/useSafetySheetsState';
import { useSafetySheetsActions } from '../hooks/useSafetySheetsActions';
import { SafetySheetsTable } from './SafetySheetsTable';
import { SafetySheetsModals } from './SafetySheetsModals';

export function MSDSSafetySheets({ onBack }: MSDSSafetySheetsProps) {
  const {
    msdsSheets,
    coshhRegister,
    loading,
    modalState,
    searchState,
    formData,
    setModalState,
    setFormData,
    fetchMSDSSheets,
    handleRegisterSelection,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openUploadModal,
    openDeleteModal,
    closeAllModals,
    updateSearchTerm,
    formatFileSize
  } = useSafetySheetsState();

  const { uploadMSDS, deleteMSDS, downloadMSDS, previewMSDS } = useSafetySheetsActions();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modalState.showUploadModal || modalState.showDeleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalState.showUploadModal, modalState.showDeleteModal]);

  const handleUpload = async () => {
    if (!modalState.selectedFile) return;

    try {
      setModalState(prev => ({ ...prev, uploading: true }));
      await uploadMSDS(formData, modalState.selectedFile);
      closeAllModals();
      fetchMSDSSheets();
    } catch (error) {
      console.error('Error uploading MSDS:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setModalState(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleConfirmDelete = async () => {
    if (!modalState.selectedSheetForDelete) return;

    try {
      setModalState(prev => ({ ...prev, deleting: true }));
      await deleteMSDS(modalState.selectedSheetForDelete);
      closeAllModals();
      fetchMSDSSheets();
    } catch (error) {
      console.error('Error deleting MSDS:', error);
      alert('Error deleting MSDS sheet. Please try again.');
    } finally {
      setModalState(prev => ({ ...prev, deleting: false }));
    }
  };

  const handleDownload = async (msds: any) => {
    try {
      await downloadMSDS(msds);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file.');
    }
  };

  const handlePreview = async (msds: any) => {
    try {
      await previewMSDS(msds);
    } catch (error) {
      console.error('Error previewing file:', error);
      alert('Error previewing file.');
    }
  };

  const removeSelectedFile = () => {
    setModalState(prev => ({ ...prev, selectedFile: null }));
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to COSHH Management
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            MSDS Safety Sheets
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage Material Safety Data Sheets for hazardous substances
          </p>
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search MSDS sheets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={searchState.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={openUploadModal}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add MSDS Sheet
        </button>
      </div>

      {/* Content Area */}
      {searchState.filteredSheets.length === 0 && !loading && searchState.searchTerm ? (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="p-6">
            <div className="text-center py-12">
              <FileCheck className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No MSDS sheets found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                No MSDS sheets match "{searchState.searchTerm}"
              </p>
            </div>
          </div>
        </div>
      ) : (
        <SafetySheetsTable
          sheets={searchState.filteredSheets}
          loading={loading}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onDelete={openDeleteModal}
          formatFileSize={formatFileSize}
        />
      )}

      {/* Add empty state for no search term */}
      {searchState.filteredSheets.length === 0 && !loading && !searchState.searchTerm && (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="p-6">
            <div className="text-center py-12">
              <FileCheck className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No MSDS Safety Sheets Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get started by adding your first Material Safety Data Sheet
              </p>
              <button
                onClick={openUploadModal}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First MSDS Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SafetySheetsModals
        modalState={modalState}
        formData={formData}
        setFormData={setFormData}
        coshhRegister={coshhRegister}
        onRegisterSelection={handleRegisterSelection}
        onFileInputChange={handleFileInputChange}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onUpload={handleUpload}
        onCloseModals={closeAllModals}
        onConfirmDelete={handleConfirmDelete}
        formatFileSize={formatFileSize}
        removeSelectedFile={removeSelectedFile}
      />
    </div>
  );
}
