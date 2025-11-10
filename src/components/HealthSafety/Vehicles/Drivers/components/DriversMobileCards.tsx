import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { getExpiryColor, getCheckColor } from '../../shared/utils/helpers';
import type { Driver, StaffMember } from '../../shared/types';

interface DriversMobileCardsProps {
  drivers: Driver[];
  staff: StaffMember[];
  isAdminView: boolean;
  onEditDriver: (driver: Driver, staffMember: StaffMember | null) => void;
  onDeleteDriver: (driverId: string) => void;
}

export const DriversMobileCards: React.FC<DriversMobileCardsProps> = ({
  drivers,
  staff,
  isAdminView,
  onEditDriver,
  onDeleteDriver
}) => {
  return (
    <div className="lg:hidden">
      <div className="p-4 space-y-4">
        {drivers.map((driver) => {
          const staffMember = staff.find((s) => s.id === driver.staff_id);
          return (
            <div 
              key={driver.id}
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 transition-shadow ${isAdminView ? 'cursor-pointer hover:shadow-lg' : ''}`}
              onClick={() => {
                if (isAdminView) {
                  onEditDriver(driver, staffMember || null);
                }
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {driver.full_name || staffMember?.name || 'Unknown Driver'}
                  </h4>
                  {isAdminView && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Licence: {driver.licence_number}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Licence Expiry:</span>
                  <span className={getExpiryColor(driver.licence_expiry)}>
                    {driver.licence_expiry
                      ? new Date(driver.licence_expiry).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Last Check:</span>
                  <span className={getCheckColor(driver.last_check)}>
                    {driver.last_check
                      ? new Date(driver.last_check).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
                {isAdminView && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Points:</span>
                    <span className="text-gray-900 dark:text-white">
                      {driver.points || 0}
                    </span>
                  </div>
                )}
              </div>

              {isAdminView && (
                <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDriver(driver, staffMember || null);
                    }}
                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDriver(driver.id);
                    }}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
