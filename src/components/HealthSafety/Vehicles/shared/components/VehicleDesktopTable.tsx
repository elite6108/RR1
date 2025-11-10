import React from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { NumberPlate } from './NumberPlate';
import { getDateStatus } from '../utils/helpers';

interface VehicleDesktopTableProps {
  vehicles: any[];
  onEditVehicle: (vehicle: any) => void;
  onDeleteVehicle: (vehicleId: string) => void;
}

export const VehicleDesktopTable: React.FC<VehicleDesktopTableProps> = ({
  vehicles,
  onEditVehicle,
  onDeleteVehicle
}) => {
  return (
    <div className="hidden lg:block overflow-hidden">
      <table
        id="vehicle-table"
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
      >
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:rounded-tl-lg"
            >
              REG
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              MAKE
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              MODEL
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              DRIVER
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              MOT
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              TAX
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              LAST SERVICE
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              SERVICE DUE
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              INSURANCE
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              BREAKDOWN
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              CONGESTION
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              DARTFORD
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              CLEAN AIR
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              ULEZ
            </th>
            <th
              scope="col"
              className="py-3 px-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider last:rounded-tr-lg"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {vehicles.map((vehicle, index) => {
            const motStatus = getDateStatus(vehicle.mot_date);
            const taxStatus = getDateStatus(vehicle.tax_date);
            const serviceStatus = getDateStatus(vehicle.service_date);
            const insuranceStatus = getDateStatus(vehicle.insurance_date);
            const breakdownStatus = getDateStatus(vehicle.breakdown_date);
            const lastServiceStatus = getDateStatus(vehicle.last_service_date);

            return (
              <tr
                key={vehicle.id}
                className={`${
                  index % 2 === 0
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-gray-50 dark:bg-gray-700'
                } hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer`}
                onClick={() => onEditVehicle(vehicle)}
              >
                <td className="py-2 px-3 text-sm text-gray-900 dark:text-white first:rounded-bl-lg">
                  <NumberPlate registration={vehicle.registration} className="mr-0" />
                </td>
                <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                  {vehicle.make}
                </td>
                <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                  {vehicle.model}
                </td>
                <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                  {vehicle.driver}
                </td>
                <td className="py-2 px-3 text-sm">
                  <span className={motStatus.color}>
                    {motStatus.text}
                  </span>
                </td>
                <td className="py-2 px-3 text-sm">
                  <span className={taxStatus.color}>
                    {taxStatus.text}
                  </span>
                </td>
                <td className="py-2 px-3 text-sm">
                  <span className={lastServiceStatus.color}>
                    {lastServiceStatus.text}
                  </span>
                </td>
                <td className="py-2 px-3 text-sm">
                  <span className={serviceStatus.color}>
                    {serviceStatus.text}
                  </span>
                </td>
                <td className="py-2 px-3 text-sm">
                  <span className={insuranceStatus.color}>
                    {insuranceStatus.text}
                  </span>
                </td>
                <td className="py-2 px-3 text-sm">
                  <span className={breakdownStatus.color}>
                    {breakdownStatus.text}
                  </span>
                </td>
                <td className="py-2 px-3 text-sm">
                  {vehicle.has_congestion ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                </td>
                <td className="py-2 px-3 text-sm">
                  {vehicle.has_dartford ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                </td>
                <td className="py-2 px-3 text-sm">
                  {vehicle.has_clean_air ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                </td>
                <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                  {vehicle.ulez === 'should_be_paid' ? 'Should be paid' : 
                   vehicle.ulez === 'meets_standard' ? 'Meets standard' : 
                   '-'}
                </td>
                <td className="py-2 px-3 text-right text-sm font-medium last:rounded-br-lg">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditVehicle(vehicle);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVehicle(vehicle.id);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
