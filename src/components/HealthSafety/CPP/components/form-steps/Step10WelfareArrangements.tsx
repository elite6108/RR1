import React from 'react';
import { Check } from 'lucide-react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step10WelfareArrangementsProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const WELFARE_OPTIONS = [
  {
    id: 'option1',
    label: 'Groundhog/Oasis Integrated Welfare Unit',
  },
  {
    id: 'option2',
    label: 'Mobile Welfare Unit',
  },
  {
    id: 'option3',
    label: 'Portaloo WC Facilities',
  },
  {
    id: 'option4',
    label:
      'Welfare and Office units, containing, WC closets (Male & Female), hand washing, hot and cold water, drying room, canteen/break out room, means to heat food.',
  },
];

export function Step10WelfareArrangements({
  data,
  onChange,
}: Step10WelfareArrangementsProps) {
  const handleOptionToggle = (optionId: string) => {
    const currentOptions = data.welfareArrangements.selectedOptions || [];
    const newOptions = currentOptions.includes(optionId)
      ? currentOptions.filter((id) => id !== optionId)
      : [...currentOptions, optionId];

    onChange({
      welfareArrangements: {
        ...data.welfareArrangements,
        selectedOptions: newOptions,
      },
    });
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      welfareArrangements: {
        ...data.welfareArrangements,
        other: e.target.value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Welfare Arrangements
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Select Welfare Arrangements
        </label>

        <div className="space-y-4">
          {WELFARE_OPTIONS.map((option) => {
            const isSelected =
              data.welfareArrangements.selectedOptions?.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionToggle(option.id)}
                className={`
                  w-full flex items-start p-4 rounded-lg border-2 transition-colors text-left
                  ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div
                  className={`
                  flex-shrink-0 h-5 w-5 mt-0.5 mr-4 rounded border-2 flex items-center justify-center
                  ${
                    isSelected
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'border-gray-300'
                  }
                `}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <span
                  className={`text-sm ${
                    isSelected ? 'text-indigo-900' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="other"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Other
        </label>
        <textarea
          id="other"
          value={data.welfareArrangements.other || ''}
          onChange={handleOtherChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter any additional welfare arrangements..."
        />
      </div>
    </div>
  );
}
