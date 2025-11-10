import React from 'react';
import { FormData } from '../../types/FormData';
import { ROOT_CAUSE_OPTIONS } from '../../types/constants';

interface RootCausesStepProps {
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
}

export default function RootCausesStep({
  formData,
  setFormData
}: RootCausesStepProps) {
  const toggleRootCause = (category: keyof typeof ROOT_CAUSE_OPTIONS, option: string) => {
    const fieldMap = {
      workEnvironment: 'rootCauseWorkEnvironment',
      humanFactors: 'rootCauseHumanFactors',
      ppe: 'rootCausePpe',
      management: 'rootCauseManagement',
      plantEquipment: 'rootCausePlantEquipment'
    } as const;
    
    const field = fieldMap[category];
    
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(option) 
        ? (prev[field] as string[]).filter(o => o !== option)
        : [...(prev[field] as string[]), option]
    }));
  };

  const isSelected = (category: keyof typeof ROOT_CAUSE_OPTIONS, option: string) => {
    const fieldMap = {
      workEnvironment: 'rootCauseWorkEnvironment',
      humanFactors: 'rootCauseHumanFactors',
      ppe: 'rootCausePpe',
      management: 'rootCauseManagement',
      plantEquipment: 'rootCausePlantEquipment'
    } as const;
    
    const field = fieldMap[category];
    return (formData[field] as string[]).includes(option);
  };

  return (
    <div className="space-y-6">
      {/* Work Environment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work Environment *</label>
        <div className="flex flex-wrap gap-2">
          {ROOT_CAUSE_OPTIONS.workEnvironment.map(option => (
            <button 
              type="button" 
              key={option} 
              onClick={() => toggleRootCause('workEnvironment', option)} 
              className={`px-3 py-1 rounded-full border ${
                isSelected('workEnvironment', option) 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Human Factors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Human Factors *</label>
        <div className="flex flex-wrap gap-2">
          {ROOT_CAUSE_OPTIONS.humanFactors.map(option => (
            <button 
              type="button" 
              key={option} 
              onClick={() => toggleRootCause('humanFactors', option)} 
              className={`px-3 py-1 rounded-full border ${
                isSelected('humanFactors', option) 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* PPE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PPE *</label>
        <div className="flex flex-wrap gap-2">
          {ROOT_CAUSE_OPTIONS.ppe.map(option => (
            <button 
              type="button" 
              key={option} 
              onClick={() => toggleRootCause('ppe', option)} 
              className={`px-3 py-1 rounded-full border ${
                isSelected('ppe', option) 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Management */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Management *</label>
        <div className="flex flex-wrap gap-2">
          {ROOT_CAUSE_OPTIONS.management.map(option => (
            <button 
              type="button" 
              key={option} 
              onClick={() => toggleRootCause('management', option)} 
              className={`px-3 py-1 rounded-full border ${
                isSelected('management', option) 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Plant / Equipment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plant / Equipment *</label>
        <div className="flex flex-wrap gap-2">
          {ROOT_CAUSE_OPTIONS.plantEquipment.map(option => (
            <button 
              type="button" 
              key={option} 
              onClick={() => toggleRootCause('plantEquipment', option)} 
              className={`px-3 py-1 rounded-full border ${
                isSelected('plantEquipment', option) 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
