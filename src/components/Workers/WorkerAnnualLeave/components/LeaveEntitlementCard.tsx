import React from 'react';
import { Calendar } from 'lucide-react';
import { LeaveEntitlement } from '../utils/annualLeaveUtils';

interface LeaveEntitlementCardProps {
  entitlement: LeaveEntitlement | null;
  loading: boolean;
  onRequestLeave: () => void;
}

export const LeaveEntitlementCard: React.FC<LeaveEntitlementCardProps> = ({
  entitlement,
  loading,
  onRequestLeave
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Your Leave Balance
      </h3>
      
      {entitlement ? (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Entitlement:</span>
            <span className="font-semibold">{entitlement.total_entitlement} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Used:</span>
            <span className="font-semibold">{entitlement.used_days} days</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-900 dark:text-white font-semibold">Remaining:</span>
            <span className="font-bold text-blue-600">{entitlement.remaining_days} days</span>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">Loading...</div>
      )}

      <button
        onClick={onRequestLeave}
        className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        <Calendar className="h-4 w-4 inline mr-2" />
        Request Leave
      </button>
    </div>
  );
};