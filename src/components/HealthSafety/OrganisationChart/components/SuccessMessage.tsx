import React from 'react';
import { Check, X } from 'lucide-react';

interface SuccessMessageProps {
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  successMessage,
  setSuccessMessage
}) => {
  if (!successMessage) return null;

  return (
    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <Check className="w-5 h-5 mr-2 text-green-500" />
        <p>{successMessage}</p>
      </div>
      <button 
        onClick={() => setSuccessMessage(null)} 
        className="text-green-500 hover:text-green-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
