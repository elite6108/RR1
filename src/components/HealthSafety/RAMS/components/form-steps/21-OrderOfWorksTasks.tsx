import React, { useState } from 'react';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';
import { AIOrderOfWorksHelper } from '../AIOrderOfWorksHelper';

interface OrderOfWorksTasksProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function OrderOfWorksTasks({ data, onChange }: OrderOfWorksTasksProps) {
  const [activeTab, setActiveTab] = useState<'groundworks' | 'custom'>(data.order_of_works_task || 'groundworks');
  const [showAIHelper, setShowAIHelper] = useState(false);

  const handleTabChange = (tab: 'groundworks' | 'custom') => {
    setActiveTab(tab);
    onChange({ order_of_works_task: tab });
  };

  const handleAIClick = () => {
    setShowAIHelper(true);
  };
  
  const handleApplyOrderOfWorks = (orderOfWorks: string) => {
    onChange({ order_of_works_custom: orderOfWorks });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Order of Works Tasks</h3>

      <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 mb-6">
        <button
          type="button"
          onClick={() => handleTabChange('groundworks')}
          className={`w-full px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            activeTab === 'groundworks'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
Templating & Installing Worktops
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('custom')}
          className={`w-full px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            activeTab === 'custom'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Custom
        </button>
      </div>

      {activeTab === 'groundworks' ? (
        <div className="space-y-6">
          <div>
            <label htmlFor="delivery_info" className="block text-sm font-medium text-gray-700 mb-2">
              Delivery *
            </label>
            <textarea
              id="delivery_info"
              value={data.delivery_info || RAMS_DEFAULTS.DELIVERY_INFO}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ delivery_info: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="groundworks_info" className="block text-sm font-medium text-gray-700 mb-2">
              Templating & Installing Worktops *
            </label>
            <textarea
              id="groundworks_info"
              value={data.groundworks_info || RAMS_DEFAULTS.GROUNDWORKS_INFO}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ groundworks_info: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
              <label htmlFor="order_of_works_custom" className="block text-sm font-medium text-gray-700">
                Custom Order of Works *
              </label>
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
            <textarea
              id="order_of_works_custom"
              value={data.order_of_works_custom}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ order_of_works_custom: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter custom order of works..."
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information *
        </label>
        <textarea
          id="additional_info"
          value={data.additional_info}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ additional_info: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter any additional information..."
        />
      </div>
      
      {/* AI Order of Works Helper Modal */}
      <AIOrderOfWorksHelper
        isOpen={showAIHelper}
        onClose={() => setShowAIHelper(false)}
        onApplyOrderOfWorks={handleApplyOrderOfWorks}
        ramsDetails={{
          reference: data.reference || '',
          clientName: data.client_name || '',
          description: data.description || '',
          sequence: data.sequence || '',
          siteManager: data.site_manager || '',
          assessor: data.assessor || ''
        }}
      />
    </div>
  );
}