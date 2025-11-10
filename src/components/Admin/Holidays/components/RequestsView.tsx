import React from 'react';
import { Calendar, Eye } from 'lucide-react';
import type { RequestsViewProps, LeaveRequest } from '../types';

export function RequestsView({ 
  requests, 
  loading, 
  isAdmin, 
  viewMode, 
  onApprove, 
  getStatusIcon, 
  getStatusColor 
}: RequestsViewProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading requests...</div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No leave requests found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request: LeaveRequest) => (
        <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Mobile Card Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(request.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(request.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {request.user_type === 'worker' ? '👷' : '👔'}
              </span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{request.user_name}</div>
                <div className="text-sm text-gray-500">{request.user_email}</div>
              </div>
            </div>
          </div>
        
          {/* Mobile Card Content */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Start Date:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {new Date(request.start_date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">End Date:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {new Date(request.end_date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Duration:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {request.total_days} day{request.total_days !== 1 ? 's' : ''}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Type:</span>
                <div className="font-medium text-gray-900 dark:text-white capitalize">
                  {request.leave_type.startsWith('half_day') ? 'Half Day' : request.leave_type.replace('_', ' ')}
                </div>
              </div>
            </div>

            {request.reason && (
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Reason:</span>
                <div className="font-medium text-gray-900 dark:text-white mt-1">
                  {request.reason}
                </div>
              </div>
            )}

            {request.admin_notes && (
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Admin Notes:</span>
                <div className="font-medium text-blue-600 mt-1">
                  {request.admin_notes}
                </div>
              </div>
            )}

            {/* Action Button */}
            {isAdmin && request.status === 'pending' && viewMode === 'all_requests' && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onApprove(request)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review Request
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
