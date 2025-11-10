import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface PDFFile {
  id: string;
  name: string;
  displayName: string;
  url: string;
  signed_url?: string;
}

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfFile: PDFFile;
}

interface PDFUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPDFs: PDFFile[];
  selectedNewPDF: string;
  setSelectedNewPDF: (value: string) => void;
  onUpdate: () => void;
  loading: boolean;
}

export function PDFViewerModal({ isOpen, onClose, pdfFile }: PDFViewerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-6xl w-full m-4 h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {pdfFile.displayName}
          </h3>
          <div className="flex items-center space-x-4">
            <a
              href={pdfFile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={pdfFile.signed_url || ''}
            className="w-full h-full"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
}

export function PDFUpdateModal({
  isOpen,
  onClose,
  allPDFs,
  selectedNewPDF,
  setSelectedNewPDF,
  onUpdate,
  loading
}: PDFUpdateModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setSelectedNewPDF('');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Update PDF Document
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New PDF
            </label>
            <select
              value={selectedNewPDF}
              onChange={(e) => setSelectedNewPDF(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a PDF</option>
              {allPDFs.map((file) => (
                <option key={file.id} value={file.name}>
                  {file.displayName || file.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onUpdate}
              disabled={!selectedNewPDF || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
