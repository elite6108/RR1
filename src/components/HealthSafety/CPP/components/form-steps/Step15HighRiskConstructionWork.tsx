import React from 'react';
import { Check } from 'lucide-react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step15HighRiskConstructionWorkProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const HIGH_RISK_OPTIONS = [
  {
    id: 'option1',
    label: 'Work which puts workers at risk of burial under earthfalls, engulfment in swampland or falling from a height, where the risk is particularly aggravated by the nature of the work or processes used or by the environment at the place of work or site.'
  },
  {
    id: 'option2',
    label: 'Work which puts workers at risk from chemical or biological substances constituting a particular danger to the health or safety of workers or involving a legal requirement for health monitoring.'
  },
  {
    id: 'option3',
    label: 'Work with ionizing radiation requiring the designation of controlled or supervised areas under regulation 16 of the Ionising Radiations Regulations 1999(17).'
  },
  {
    id: 'option4',
    label: 'Work near high voltage power lines.'
  },
  {
    id: 'option5',
    label: 'Work exposing workers to the risk of drowning.'
  },
  {
    id: 'option6',
    label: 'Work on wells, underground earthworks and tunnels.'
  },
  {
    id: 'option7',
    label: 'Work carried out by divers having a system of air supply.'
  },
  {
    id: 'option8',
    label: 'Work carried out by workers in caissons with a compressed air atmosphere.'
  },
  {
    id: 'option9',
    label: 'Work involving the use of explosives.'
  },
  {
    id: 'option10',
    label: 'Work involving the assembly or dismantling of heavy prefabricated components.'
  },
  {
    id: 'option11',
    label: 'Work involving entry to confined spaces'
  }
];

export function Step15HighRiskConstructionWork({ data, onChange }: Step15HighRiskConstructionWorkProps) {
  const handleOptionToggle = (optionId: string) => {
    const currentOptions = data.highRiskWork.selectedOptions || [];
    const newOptions = currentOptions.includes(optionId)
      ? currentOptions.filter(id => id !== optionId)
      : [...currentOptions, optionId];
    
    onChange({
      highRiskWork: {
        ...data.highRiskWork,
        selectedOptions: newOptions
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">High Risk Construction Work</h3>
      
      <div>
        <p className="text-sm text-gray-500 mb-4">
          The following is the list of high risk construction work (HRCW) that require a Risk Assessment Method Statement (RAMS) to be prepared, submitted and reviewed prior to work beginning. Select which work applies to the site:
        </p>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
          {HIGH_RISK_OPTIONS.map(option => {
            const isSelected = data.highRiskWork.selectedOptions?.includes(option.id);
            
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