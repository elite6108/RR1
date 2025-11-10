import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';

interface InspectionItem {
  id: string;
  item_id: number;
  item_description: string;
  recommended_quantity: string;
  expected_quantity: string;
  actual_quantity: string;
  status: 'yes' | 'no';
  action_notes: string;
}

interface ViewInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspectionId: string;
  kitName: string;
  inspectionDate: string;
  inspectorName: string;
  overallStatus: 'passed' | 'failed' | 'needs_attention';
  itemsPassed: number;
  itemsFailed: number;
  generalNotes?: string;
}

function ViewInspectionModal({
  isOpen,
  onClose,
  inspectionId,
  kitName,
  inspectionDate,
  inspectorName,
  overallStatus,
  itemsPassed,
  itemsFailed,
  generalNotes
}: ViewInspectionModalProps) {
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && inspectionId) {
      fetchInspectionItems();
    }
  }, [isOpen, inspectionId]);

  const fetchInspectionItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('first_aid_kit_inspection_items')
        .select('*')
        .eq('inspection_id', inspectionId)
        .order('item_id');

      if (error) throw error;
      setInspectionItems(data || []);
    } catch (error) {
      console.error('Error fetching inspection items:', error);
      setInspectionItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: 'passed' | 'failed' | 'needs_attention') => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'passed':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      case 'needs_attention':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
      default:
        return baseClasses;
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Inspection Results
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Inspection Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kit Name
              </label>
              <p className="text-sm text-gray-900 dark:text-white">{kitName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Inspector
              </label>
              <p className="text-sm text-gray-900 dark:text-white">{inspectorName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Inspection Date
              </label>
              <p className="text-sm text-gray-900 dark:text-white">{formatDate(inspectionDate)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Status
              </label>
              <span className={getStatusBadge(overallStatus)}>
                {overallStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Results Summary
              </label>
              <div className="space-y-1">
                <p className="text-sm text-green-600 dark:text-green-400">
                  {itemsPassed} items passed
                </p>
                {itemsFailed > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {itemsFailed} items failed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* General Notes */}
        {generalNotes && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              General Notes
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-900 dark:text-white">{generalNotes}</p>
            </div>
          </div>
        )}

        {/* Inspection Items */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Inspection Items
          </h4>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">Loading inspection details...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Expected
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actual
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {inspectionItems.map((item) => (
                    <tr key={item.id} className={item.status === 'no' ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.item_id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.item_description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.recommended_quantity || item.expected_quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.actual_quantity || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'yes' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {item.status === 'yes' ? 'Present' : 'Missing'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.action_notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export { ViewInspectionModal };
