import React from 'react';
import { Edit } from 'lucide-react';
import type { EntitlementsViewProps, LeaveEntitlement } from '../types';

export function EntitlementsView({ entitlements, loading, onEditEntitlement }: EntitlementsViewProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading entitlements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entitlements.map((entitlement: LeaveEntitlement) => (
        <div
          key={`${entitlement.user_id}-${entitlement.year}`}
          onClick={() => onEditEntitlement(entitlement)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
        >
          {/* Card Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {entitlement.user_type === 'worker' ? '👷' : '👔'}
                </span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {entitlement.user_name}
                  </div>
                  <div className="text-sm text-gray-500">{entitlement.user_email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Edit className="h-4 w-4" />
                <span className="text-xs hidden sm:block">Tap to edit</span>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {entitlement.total_entitlement}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Total Days
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {entitlement.used_days}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 font-medium mb-2">
                  Used Days
                </div>
                {/* Progress Bar inside Used Days cell */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      (entitlement.used_days / entitlement.total_entitlement) > 0.8 ? 'bg-red-500' :
                      (entitlement.used_days / entitlement.total_entitlement) > 0.6 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((entitlement.used_days / entitlement.total_entitlement) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className={`rounded-lg p-3 ${
                entitlement.remaining_days < 5 ? 'bg-red-50 dark:bg-red-900/20' : 
                entitlement.remaining_days < 10 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                'bg-green-50 dark:bg-green-900/20'
              }`}>
                <div className={`text-2xl font-bold ${
                  entitlement.remaining_days < 5 ? 'text-red-600 dark:text-red-400' : 
                  entitlement.remaining_days < 10 ? 'text-yellow-600 dark:text-yellow-400' : 
                  'text-green-600 dark:text-green-400'
                }`}>
                  {entitlement.remaining_days}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
