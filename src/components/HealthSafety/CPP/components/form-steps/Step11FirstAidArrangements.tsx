import React from 'react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step11FirstAidArrangementsProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step11FirstAidArrangements({ data, onChange }: Step11FirstAidArrangementsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      firstAidArrangements: {
        ...data.firstAidArrangements,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">First Aid Arrangements</h3>
      <div className="max-h-[600px] overflow-y-auto pr-4">
        <div className="space-y-6">
          <label htmlFor="arrangements" className="block text-sm font-medium text-gray-700 mb-2">
            What are the first aid arrangements for this site?
          </label>
          <textarea
            id="arrangements"
            name="arrangements"
            rows={4}
            value={data.firstAidArrangements.arrangements || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="safetyManagerName" className="block text-sm font-medium text-gray-700 mb-2">
              Safety Manager Name
            </label>
            <input
              type="text"
              id="safetyManagerName"
              name="safetyManagerName"
              value={data.firstAidArrangements.safetyManagerName || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="safetyManagerPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Safety Manager Phone
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                +44
              </span>
              <input
                type="tel"
                id="safetyManagerPhone"
                name="safetyManagerPhone"
                value={data.firstAidArrangements.safetyManagerPhone || ''}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="firstAiderName" className="block text-sm font-medium text-gray-700 mb-2">
              Trained First Aider Name
            </label>
            <input
              type="text"
              id="firstAiderName"
              name="firstAiderName"
              value={data.firstAidArrangements.firstAiderName || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="firstAiderPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Trained First Aider Phone
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                +44
              </span>
              <input
                type="tel"
                id="firstAiderPhone"
                name="firstAiderPhone"
                value={data.firstAidArrangements.firstAiderPhone || ''}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="firstAidKitLocation" className="block text-sm font-medium text-gray-700 mb-2">
            First Aid Kit Location
          </label>
          <input
            type="text"
            id="firstAidKitLocation"
            name="firstAidKitLocation"
            value={data.firstAidArrangements.firstAidKitLocation || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="fireEquipmentLocation" className="block text-sm font-medium text-gray-700 mb-2">
            Fire Fighting Equipment Location
          </label>
          <input
            type="text"
            id="fireEquipmentLocation"
            name="fireEquipmentLocation"
            value={data.firstAidArrangements.fireEquipmentLocation || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="emergencySignal" className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Signal
          </label>
          <input
            type="text"
            id="emergencySignal"
            name="emergencySignal"
            value={data.firstAidArrangements.emergencySignal || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="assemblyArea" className="block text-sm font-medium text-gray-700 mb-2">
            Assembly Area
          </label>
          <input
            type="text"
            id="assemblyArea"
            name="assemblyArea"
            value={data.firstAidArrangements.assemblyArea || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="nearestMedical" className="block text-sm font-medium text-gray-700 mb-2">
            Nearest A&E or Medical Centre
          </label>
          <textarea
            id="nearestMedical"
            name="nearestMedical"
            rows={3}
            value={data.firstAidArrangements.nearestMedical || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}