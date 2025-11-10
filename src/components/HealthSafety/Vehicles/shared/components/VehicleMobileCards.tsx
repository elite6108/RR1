import React from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { NumberPlate } from './NumberPlate';
import { getDateStatus } from '../utils/helpers';

interface VehicleMobileCardsProps {
  vehicles: any[];
  onEditVehicle: (vehicle: any) => void;
  onDeleteVehicle: (vehicleId: string) => void;
}

export const VehicleMobileCards: React.FC<VehicleMobileCardsProps> = ({
  vehicles,
  onEditVehicle,
  onDeleteVehicle
}) => {
  return (
    <div className="lg:hidden">
      <div className="p-4 space-y-4">
        {vehicles.map((vehicle) => {
          const motStatus = getDateStatus(vehicle.mot_date);
          const taxStatus = getDateStatus(vehicle.tax_date);
          const serviceStatus = getDateStatus(vehicle.service_date);
          const insuranceStatus = getDateStatus(vehicle.insurance_date);
          const breakdownStatus = getDateStatus(vehicle.breakdown_date);
          const congestionStatus = getDateStatus(vehicle.congestion_date);
          const dartfordStatus = getDateStatus(vehicle.dartford_date);
          const cleanAirStatus = getDateStatus(vehicle.clean_air_date);
          const lastServiceStatus = getDateStatus(vehicle.last_service_date);

          return (
            <div 
              key={vehicle.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onEditVehicle(vehicle)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <NumberPlate registration={vehicle.registration} className="mb-1" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {vehicle.make} {vehicle.model}
                  </p>
                  {vehicle.driver && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Driver: {vehicle.driver}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">MOT:</span>
                    <span className={motStatus.color}>
                      {motStatus.text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tax:</span>
                    <span className={taxStatus.color}>
                      {taxStatus.text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Last Service:</span>
                    <span className={lastServiceStatus.color}>
                      {lastServiceStatus.text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Service:</span>
                    <span className={serviceStatus.color}>
                      {serviceStatus.text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Insurance:</span>
                    <span className={insuranceStatus.color}>
                      {insuranceStatus.text}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Breakdown:</span>
                    <span className={breakdownStatus.color}>
                      {breakdownStatus.text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Congestion:</span>
                    {vehicle.has_congestion ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Dartford:</span>
                    {vehicle.has_dartford ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Clean Air:</span>
                    {vehicle.has_clean_air ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">ULEZ:</span>
                    <span className="text-gray-900 dark:text-white">
                      {vehicle.ulez === 'should_be_paid' ? 'Should be paid' : 
                       vehicle.ulez === 'meets_standard' ? 'Meets standard' : 
                       '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditVehicle(vehicle);
                  }}
                  className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteVehicle(vehicle.id);
                  }}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
