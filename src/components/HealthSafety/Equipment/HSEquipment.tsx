import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { EquipmentList } from './Equipment';
import { ChecklistsList } from './Checklist';
import { 
  useEquipmentData,
  EquipmentWidget,
  ChecklistsWidget,
  RemindersWidget,
  RemindersSection
} from './shared';
import type { HSEquipmentProps } from './shared/types';
import { HSEquipmentInspections } from './HSEquipmentInspections';

export function HSEquipment({ onBack, onOverdueChecklistsChange }: HSEquipmentProps) {
  const { equipment, checklists, reminders, fetchData } = useEquipmentData(onOverdueChecklistsChange);
  const [showEquipmentList, setShowEquipmentList] = useState(false);
  const [showChecklists, setShowChecklists] = useState(false);
  const [showEquipmentInspections, setShowEquipmentInspections] = useState(false);
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(false);

  // Detect dark mode from document class
  const isDarkMode = document.documentElement.classList.contains('dark');

  if (showEquipmentList) {
    return (
      <EquipmentList
        onBack={() => {
          setShowEquipmentList(false);
          fetchData();
        }}
      />
    );
  }

  if (showChecklists) {
    return (
      <ChecklistsList
        onBack={() => {
          setShowChecklists(false);
          fetchData();
        }}
      />
    );
  }

  if (showEquipmentInspections) {
    return (
      <HSEquipmentInspections
        onBack={() => {
          setShowEquipmentInspections(false);
          fetchData();
        }}
      />
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Health & Safety
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Equipment Management
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Equipment Widget */}
          <EquipmentWidget
            count={equipment.length}
            onClick={() => setShowEquipmentList(true)}
            isDarkMode={isDarkMode}
          />

          {/* Checklists Widget */}
          <ChecklistsWidget
            count={checklists.length}
            onClick={() => setShowChecklists(true)}
            isDarkMode={isDarkMode}
          />

          {/* Inspections quick link */}
          <div
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
            onClick={() => setShowEquipmentInspections(true)}
          >
            <div className="mb-2 text-sm text-gray-500 dark:text-gray-300">Equipment</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">Inspections</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Crane / Guarding / Forklift</div>
          </div>

          {/* Reminders Widget */}
          <RemindersWidget
            count={reminders.length}
            onClick={() => setIsRemindersExpanded(!isRemindersExpanded)}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Reminders Section */}
        <RemindersSection
          reminders={reminders}
          isExpanded={isRemindersExpanded}
          onToggle={() => setIsRemindersExpanded(!isRemindersExpanded)}
        />
      </div>
    </div>
  );
}