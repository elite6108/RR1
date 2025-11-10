import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface What3WordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function What3WordsModal({ isOpen, onClose }: What3WordsModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 h-screen w-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">What3Words Location</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-0">
          <iframe
            src="https://what3words.com"
            title="What3Words Map"
            className="w-full h-[70vh]"
            allow="geolocation"
          ></iframe>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Find your location on the map, copy the three words, and paste them back into the form.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
