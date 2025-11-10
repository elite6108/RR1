import React from 'react';
import { X } from 'lucide-react';
import type { What3WordsModalProps } from '../types';
import { WHAT3WORDS_CONFIG } from '../utils/constants';

export function What3WordsModal({ isOpen, onClose }: What3WordsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
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
            src={WHAT3WORDS_CONFIG.DEFAULT_URL}
            title="What3Words Map"
            className="w-full"
            style={{ height: WHAT3WORDS_CONFIG.IFRAME_HEIGHT }}
            allow="geolocation"
          />
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
    </div>
  );
}