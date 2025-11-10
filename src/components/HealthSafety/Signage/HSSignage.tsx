import React, { useState } from 'react';
import { ArrowRight, FileText, ChevronLeft, Upload } from 'lucide-react';
import { HSBoardSignage } from './HSBoardSignage';
import { HSUploadArtwork } from './HSUploadArtwork';
import { PageLayout } from './layout/PageLayout';


interface HSSignageProps {
  onBack: () => void;
}

export function HSSignage({ onBack }: HSSignageProps) {
  const [showBoardSignage, setShowBoardSignage] = useState(false);
  const [showUploadArtwork, setShowUploadArtwork] = useState(false);

  if (showBoardSignage) {
    return <HSBoardSignage onBack={() => setShowBoardSignage(false)} />;
  }

  if (showUploadArtwork) {
    return <HSUploadArtwork onBack={() => setShowUploadArtwork(false)} />;
  }

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Health & Safety
        </button>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">Signage</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Board Signage Widget */}
        <button
          onClick={() => setShowBoardSignage(true)}
          className="bg-white shadow rounded-lg p-6 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Board Signage</h3>
              <p className="mt-1 text-sm text-gray-500">View and manage board signage</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </button>

        {/* Upload Artwork Widget */}
        <button
          onClick={() => setShowUploadArtwork(true)}
          className="bg-white shadow rounded-lg p-6 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Upload Artwork</h3>
              <p className="mt-1 text-sm text-gray-500">Manage signage artwork files</p>
            </div>
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
        </button>
      </div>
    </>
  );
}