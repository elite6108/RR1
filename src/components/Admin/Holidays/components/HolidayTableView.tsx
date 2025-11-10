import React from 'react';
import { Calendar } from 'lucide-react';
import type { HolidayTableViewProps, LeaveEntitlement, LeaveRequest } from '../types';

export function HolidayTableView({ entitlements, requests, loading }: HolidayTableViewProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading holiday data...</div>
      </div>
    );
  }

  // Calculate holidays taken for each user from approved requests
  const holidayData = entitlements.map((entitlement: LeaveEntitlement) => {
    const userRequests = requests.filter((req: LeaveRequest) => 
      req.user_email === entitlement.user_email && req.status === 'approved'
    );
    
    const totalHolidaysTaken = userRequests.reduce((sum: number, req: LeaveRequest) => 
      sum + req.total_days, 0
    );

    return {
      ...entitlement,
      holidays_taken: totalHolidaysTaken,
      holidays_remaining: entitlement.total_entitlement - totalHolidaysTaken
    };
  });

  if (holidayData.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No holiday data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Holiday Overview - All Employees
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Complete overview of all employee holiday entitlements and usage
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Entitlement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Taken
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {holidayData.map((employee: any) => {
                const usagePercentage = (employee.holidays_taken / employee.total_entitlement * 100).toFixed(1);
                const isHighUsage = parseFloat(usagePercentage) > 80;
                const isLowRemaining = employee.holidays_remaining < 5;
                
                return (
                  <tr key={`${employee.user_id}-${employee.year}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">
                          {employee.user_type === 'worker' ? '👷' : '👔'}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {employee.user_name}
                          </div>
                          <div className="text-sm text-gray-500">{employee.user_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">{employee.total_entitlement} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">{employee.holidays_taken} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        isLowRemaining ? 'text-red-600 dark:text-red-400' : 
                        employee.holidays_remaining < 10 ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {employee.holidays_remaining} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full">
                        <div className={`text-sm font-medium mb-2 ${
                          isHighUsage ? 'text-red-600 dark:text-red-400' : 
                          parseFloat(usagePercentage) > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {usagePercentage}%
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isHighUsage ? 'bg-red-500' : 
                              parseFloat(usagePercentage) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(parseFloat(usagePercentage), 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {holidayData.map((employee: any) => {
          const usagePercentage = (employee.holidays_taken / employee.total_entitlement * 100).toFixed(1);
          const isHighUsage = parseFloat(usagePercentage) > 80;
          const isLowRemaining = employee.holidays_remaining < 5;
          
          return (
            <div key={`${employee.user_id}-${employee.year}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {employee.user_type === 'worker' ? '👷' : '👔'}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {employee.user_name}
                    </div>
                    <div className="text-sm text-gray-500">{employee.user_email}</div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {employee.total_entitlement}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Entitlement
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {employee.holidays_taken}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Taken
                    </div>
                  </div>
                  
                  <div className={`rounded-lg p-3 text-center ${
                    isLowRemaining ? 'bg-red-50 dark:bg-red-900/20' : 
                    employee.holidays_remaining < 10 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                    'bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <div className={`text-lg font-bold ${
                      isLowRemaining ? 'text-red-600 dark:text-red-400' : 
                      employee.holidays_remaining < 10 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {employee.holidays_remaining}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Remaining
                    </div>
                  </div>
                  
                  <div className={`rounded-lg p-3 text-center ${
                    isHighUsage ? 'bg-red-50 dark:bg-red-900/20' : 
                    parseFloat(usagePercentage) > 60 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                    'bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <div className={`text-lg font-bold ${
                      isHighUsage ? 'text-red-600 dark:text-red-400' : 
                      parseFloat(usagePercentage) > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {usagePercentage}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      Usage
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isHighUsage ? 'bg-red-500' : 
                          parseFloat(usagePercentage) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(parseFloat(usagePercentage), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
