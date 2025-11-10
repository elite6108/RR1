import React from 'react';
import { Calendar } from 'lucide-react';
import { LeaveRequest, getStatusIcon, getStatusColor, getStatusIconColor, formatLeaveType } from '../utils/annualLeaveUtils';

interface LeaveRequestsListProps {
  requests: LeaveRequest[];
  loading: boolean;
}

export const LeaveRequestsList: React.FC<LeaveRequestsListProps> = ({
  requests,
  loading
}) => {
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
        <p className="text-gray-500">No leave requests yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const StatusIcon = getStatusIcon(request.status);
        
        return (
          <div key={request.id} className="border rounded-lg p-4 bg-white dark:bg-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon className={`h-5 w-5 ${getStatusIconColor(request.status)}`} />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Dates:</span>
                    <div className="font-medium">
                      {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                    <div className="font-medium">{request.total_days} day{request.total_days !== 1 ? 's' : ''}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Type:</span>
                    <div className="font-medium capitalize">
                      {formatLeaveType(request.leave_type)}
                    </div>
                  </div>
                  {request.reason && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Reason:</span>
                      <div className="font-medium">{request.reason}</div>
                    </div>
                  )}
                  {request.admin_notes && (
                    <div className="col-span-2">
                      <span className="text-gray-600 dark:text-gray-300">Admin Notes:</span>
                      <div className="font-medium text-blue-600">{request.admin_notes}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {new Date(request.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};