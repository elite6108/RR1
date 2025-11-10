import React from 'react';
import { Info } from 'lucide-react';
import { ImageSelectionProps } from '../../types';

export function ImageSelection({ 
  label, 
  images, 
  selectedImage, 
  onChange, 
  tip 
}: ImageSelectionProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label} *</label>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onChange(image.id)}
            className={`p-4 border rounded-lg ${
              selectedImage === image.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-sm text-gray-700">{image.label}</div>
            {/* Add image here */}
          </button>
        ))}
      </div>
      {tip && (
        <div className="flex items-start mt-2 text-sm text-gray-500">
          <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{tip}</span>
        </div>
      )}
    </div>
  );
}
