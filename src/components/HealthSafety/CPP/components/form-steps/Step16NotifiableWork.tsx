import React from 'react';
import { Check } from 'lucide-react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step16NotifiableWorkProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const NOTIFIABLE_OPTIONS = [
  {
    id: 'option1',
    label: 'The project will last more than 30 days, and more than 20 workers working simultaneously on site at any point during the project'
  },
  {
    id: 'option2',
    label: 'The project will exceed 500 person days'
  },
  {
    id: 'option3',
    label: 'Licenced Asbestos Work'
  },
  {
    id: 'option4',
    label: 'Non-licenced Asbestos Work'
  }
];

export function Step16NotifiableWork({ data, onChange }: Step16NotifiableWorkProps) {
  const handleOptionToggle = (optionId: string) => {
    const currentOptions = data.notifiableWork.selectedOptions || [];
    const newOptions = currentOptions.includes(optionId)
      ? currentOptions.filter(id => id !== optionId)
      : [...currentOptions, optionId];
    
    onChange({
      notifiableWork: {
        ...data.notifiableWork,
        selectedOptions: newOptions
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Notifiable Work</h3>
      
      <div>
        <p className="text-sm text-gray-500 mb-4">
          The following questions will provide the list of notifiable work that requires you to contact the HSE.
          Select the Notifiable Work that will take place on your site:
        </p>

        <div className="space-y-4">
          {NOTIFIABLE_OPTIONS.map(option => {
            const isSelected = data.notifiableWork.selectedOptions?.includes(option.id);
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionToggle(option.id)}
                className={`
                  w-full flex items-start p-4 rounded-lg border-2 transition-colors text-left
                  ${isSelected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className={`
                  flex-shrink-0 h-5 w-5 mt-0.5 mr-4 rounded border-2 flex items-center justify-center
                  ${isSelected
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'border-gray-300'
                  }
                `}>
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className={`text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}