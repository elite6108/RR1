import React from 'react';
import { Plus } from 'lucide-react';
import { NumberPlate } from '../../shared/components/NumberPlate';
import { getLastCheckInfo } from '../utils/checklistHelpers';
import { ChecklistDesktopTable } from './ChecklistDesktopTable';
import { ChecklistMobileCards } from './ChecklistMobileCards';
import type { VehicleChecklist } from '../../shared/types';

interface VehicleCardProps {
  vehicle: any;
  checklists: VehicleChecklist[];
  generatingPdfId: string | null;
  onNewChecklist: (vehicle: any) => void;
  onEditChecklist: (vehicle: any, checklist: VehicleChecklist) => void;
  onViewPDF: (checklist: VehicleChecklist) => void;
  onDeleteChecklist: (checklist: VehicleChecklist) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  checklists,
  generatingPdfId,
  onNewChecklist,
  onEditChecklist,
  onViewPDF,
  onDeleteChecklist
}) => {
  const vehicleChecklists = checklists.filter(
    (c) => c.vehicle_id === vehicle.id
  );
  const checkInfo = getLastCheckInfo(vehicle.id, checklists);
  const textColorClass = checkInfo.isOverdue
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <NumberPlate registration={vehicle.registration} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white break-words">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className={`text-sm ${textColorClass}`}>
            Last Check: {checkInfo.date || 'Not checked yet'}
            {checkInfo.frequency && ` (${checkInfo.frequency})`}
          </p>
        </div>
        <button
          onClick={() => onNewChecklist(vehicle)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Checklist
        </button>
      </div>

      {vehicleChecklists.length > 0 && (
        <div className="mt-4">
          <ChecklistDesktopTable
            checklists={vehicleChecklists}
            generatingPdfId={generatingPdfId}
            onEditChecklist={(checklist) => onEditChecklist(vehicle, checklist)}
            onViewPDF={onViewPDF}
            onDeleteChecklist={onDeleteChecklist}
          />

          <ChecklistMobileCards
            checklists={vehicleChecklists}
            generatingPdfId={generatingPdfId}
            onEditChecklist={(checklist) => onEditChecklist(vehicle, checklist)}
            onViewPDF={onViewPDF}
            onDeleteChecklist={onDeleteChecklist}
          />
        </div>
      )}
    </div>
  );
};
