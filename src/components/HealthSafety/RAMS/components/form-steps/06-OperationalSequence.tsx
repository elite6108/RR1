import React, { useState } from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { AIOperationalSequenceHelper } from '../AIOperationalSequenceHelper';

interface OperationalSequenceProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function OperationalSequence({ data, onChange }: OperationalSequenceProps) {
  const [showAIHelper, setShowAIHelper] = useState(false);
  
  const handleAIClick = () => {
    setShowAIHelper(true);
  };
  
  const handleApplySequence = (sequence: string) => {
    onChange({ sequence });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-medium text-gray-900">Operational Sequence</h3>
        <button
          type="button"
          onClick={handleAIClick}
          className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Assist
        </button>
      </div>
      
      <div>
        <label htmlFor="sequence" className="block text-sm font-medium text-gray-700 mb-2">
          Sequence of Operations *
        </label>
        <textarea
          id="sequence"
          value={data.sequence}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ sequence: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      {/* AI Operational Sequence Helper Modal */}
      <AIOperationalSequenceHelper
        isOpen={showAIHelper}
        onClose={() => setShowAIHelper(false)}
        onApplySequence={handleApplySequence}
        ramsDetails={{
          reference: data.reference || '',
          clientName: data.client_name || '',
          description: data.description || '',
          siteManager: data.site_manager || '',
          assessor: data.assessor || ''
        }}
      />
    </div>
  );
}