import React from 'react';
import { X } from 'lucide-react';
import type { FilePreviewGridProps } from '../types';

export function FilePreviewGrid({ files, onRemove, type }: FilePreviewGridProps) {
  if (files.length === 0) return null;

  return (
    <div className={`grid ${type === 'video' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'} gap-4 mt-4`}>
      {files.map((file, index) => (
        <div key={index} className="relative group">
          <div className={`${type === 'video' ? 'aspect-w-16 aspect-h-9' : 'aspect-w-1 aspect-h-1'} rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 ${type === 'video' ? 'flex items-center justify-center' : ''}`}>
            {type === 'image' ? (
              <img
                src={file}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback for broken images
                  e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Error';
                  console.error('Error loading image:', file);
                }}
              />
            ) : (
              <video
                src={file}
                controls
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}