import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { getExpiryColor, getCheckColor } from '../../shared/utils/helpers';
import type { Driver, StaffMember } from '../../shared/types';

interface DriversDesktopTableProps {
  drivers: Driver[];
  staff: StaffMember[];
  isAdminView: boolean;
  onEditDriver: (driver: Driver, staffMember: StaffMember | null) => void;
  onDeleteDriver: (driverId: string) => void;
}

export const DriversDesktopTable = ({
  drivers,
  staff,
  isAdminView,
  onEditDriver,
  onDeleteDriver
}: DriversDesktopTableProps) => {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
            >
              Name
            </th>
            {isAdminView && (
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Licence Number
              </th>
            )}
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
            >
              Licence Expiry
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
            >
              Last Check
            </th>
            {isAdminView && (
              <>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Points
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {drivers.map((driver) => {
            const staffMember = staff.find((s) => s.id === driver.staff_id);
            return (
              <tr 
                key={driver.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isAdminView ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (isAdminView) {
                    onEditDriver(driver, staffMember || null);
                  }
                }}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                  {driver.full_name || staffMember?.name || 'Unknown Driver'}
                </td>
                {isAdminView && (
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {driver.licence_number}
                  </td>
                )}
                <td className={`whitespace-nowrap px-3 py-4 text-sm ${getExpiryColor(driver.licence_expiry)}`}>
                  {driver.licence_expiry
                    ? new Date(driver.licence_expiry).toLocaleDateString()
                    : '-'}
                </td>
                <td className={`whitespace-nowrap px-3 py-4 text-sm ${getCheckColor(driver.last_check || null)}`}>
                  {driver.last_check
                    ? new Date(driver.last_check).toLocaleDateString()
                    : '-'}
                </td>
                {isAdminView && (
                  <>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {driver.points || 0}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={(e: any) => {
                            e.stopPropagation();
                            onEditDriver(driver, staffMember || null);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e: any) => {
                            e.stopPropagation();
                            onDeleteDriver(driver.id);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
